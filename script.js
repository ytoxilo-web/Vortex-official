const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const adminButton = document.querySelector(".admin-nav-button");
const adminModal = document.querySelector(".admin-modal");
const adminClose = document.querySelector(".admin-close");
const adminForm = document.querySelector(".admin-form");
const adminCodeInput = document.querySelector("#admin-code");
const adminError = document.querySelector(".admin-error");
const adminToolbar = document.querySelector(".admin-toolbar");
const adminLogout = document.querySelector(".admin-logout");
const adminReset = document.querySelector(".admin-reset");
const rosterBoard = document.querySelector(".roster-board");
const memberAdminPanel = document.querySelector(".member-admin-panel");
const addRosterButton = document.querySelector(".add-roster-button");
const memberForm = document.querySelector(".member-form");
const cancelMemberEdit = document.querySelector(".cancel-member-edit");
const memberRosterSelect = document.querySelector('[name="member-roster"]');

const CACHE_KEY = "vortex-site-content-cache";
const ROSTER_CACHE_KEY = "vortex-roster-cache";
const ADMIN_SESSION_KEY = "vortex-admin-active";
const ADMIN_CODE_SESSION_KEY = "vortex-admin-code";
const SAVE_DELAY = 450;

const CONTENT_KEYS = [
  "hero_eyebrow",
  "hero_title",
  "hero_text",
  "hero_primary_button",
  "hero_secondary_button",
  "notice_title",
  "notice_text",
  "notice_button",
  "team_eyebrow",
  "team_title",
  "team_text",
  "feature_1_title",
  "feature_1_text",
  "feature_2_title",
  "feature_2_text",
  "feature_3_title",
  "feature_3_text",
  "objectives_eyebrow",
  "objectives_title",
  "objective_1_title",
  "objective_1_text",
  "objective_2_title",
  "objective_2_text",
  "objective_3_title",
  "objective_3_text",
  "recruitment_eyebrow",
  "recruitment_title",
  "recruitment_text",
  "discord_button",
  "criteria_title",
  "criteria_1",
  "criteria_2",
  "criteria_3",
  "criteria_4",
  "criteria_5",
  "community_eyebrow",
  "community_title",
  "community_1_title",
  "community_1_text",
  "community_2_title",
  "community_2_text",
  "community_3_title",
  "community_3_text",
  "community_4_title",
  "community_4_text",
  "faq_eyebrow",
  "faq_title",
  "faq_1_question",
  "faq_1_answer",
  "faq_2_question",
  "faq_2_answer",
  "faq_3_question",
  "faq_3_answer",
  "footer_text",
];

const editableSelector = [
  "main h1",
  "main h2",
  "main h3",
  "main p",
  "main strong",
  "main li",
  "main summary",
  ".community-grid span",
  "main .button",
  ".footer p",
].join(", ");

const editableElements = Array.from(document.querySelectorAll(editableSelector)).filter(
  (element) => !element.closest(".members")
);
const contentElements = new Map();
const saveTimers = new Map();
const supabaseClient = createSupabaseClient();
let rosters = [];
let members = [];
let draggedMemberId = null;

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });
}

editableElements.forEach((element, index) => {
  const contentKey = CONTENT_KEYS[index] || `content_${index}`;

  element.dataset.contentKey = contentKey;
  element.dataset.originalText = element.innerText;
  contentElements.set(contentKey, element);

  element.addEventListener("input", () => {
    if (!isAdminActive()) {
      return;
    }

    queueContentSave(contentKey, element.innerText);
  });

  element.addEventListener("click", (event) => {
    if (isAdminActive() && element.matches("a")) {
      event.preventDefault();
    }
  });

  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      element.blur();
    }
  });
});

loadCachedContent();
loadSupabaseContent();
loadCachedRosters();
loadRosterData();
subscribeToContentChanges();
subscribeToRosterChanges();

if (adminButton) {
  adminButton.addEventListener("click", () => {
    closeMobileNav();

    if (isAdminActive()) {
      enableAdminMode();
      return;
    }

    openAdminModal();
  });
}

if (adminClose) {
  adminClose.addEventListener("click", closeAdminModal);
}

if (adminModal) {
  adminModal.addEventListener("click", (event) => {
    if (event.target === adminModal) {
      closeAdminModal();
    }
  });
}

if (adminForm) {
  adminForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!adminCodeInput || !adminCodeInput.value.trim()) {
      showAdminError("Entre le code admin.");
      return;
    }

    const adminCode = adminCodeInput.value.trim();
    const isValid = await verifyAdminCode(adminCode);

    if (!isValid) {
      showAdminError("Code incorrect.");
      return;
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    sessionStorage.setItem(ADMIN_CODE_SESSION_KEY, adminCode);
    closeAdminModal();
    enableAdminMode();
  });
}

if (adminLogout) {
  adminLogout.addEventListener("click", () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_CODE_SESSION_KEY);
    disableAdminMode();
  });
}

if (adminReset) {
  adminReset.addEventListener("click", () => {
    editableElements.forEach((element) => {
      const contentKey = element.dataset.contentKey;
      element.innerText = element.dataset.originalText;
      queueContentSave(contentKey, element.dataset.originalText);
    });
  });
}

if (addRosterButton) {
  addRosterButton.addEventListener("click", async () => {
    const name = window.prompt("Nom du roster ?", `Roster ${String.fromCharCode(65 + rosters.length)}`);

    if (!name) {
      return;
    }

    const color = window.prompt("Couleur du roster ? Exemple: #4cb8ff", "#4cb8ff") || "#4cb8ff";
    await saveRoster({
      name: name.trim(),
      color: color.trim(),
      sort_order: rosters.length,
    });
  });
}

if (memberForm) {
  memberForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(memberForm);
    const memberId = formData.get("member-id");
    const rosterId = Number(formData.get("member-roster"));
    const rosterMembers = members.filter((member) => member.roster_id === rosterId);

    await saveMember({
      id: memberId ? Number(memberId) : null,
      roster_id: rosterId,
      name: String(formData.get("member-name") || "").trim(),
      role: String(formData.get("member-role") || "").trim(),
      level: String(formData.get("member-level") || "").trim(),
      sort_order: memberId ? getMemberSortOrder(Number(memberId)) : rosterMembers.length,
    });

    hideMemberForm();
  });
}

if (cancelMemberEdit) {
  cancelMemberEdit.addEventListener("click", hideMemberForm);
}

if (isAdminActive()) {
  enableAdminMode();
}

function createSupabaseClient() {
  const config = window.VORTEX_SUPABASE || {};
  const isConfigured =
    window.supabase &&
    config.url &&
    config.anonKey &&
    !config.url.includes("YOUR_PROJECT_REF") &&
    !config.anonKey.includes("YOUR_SUPABASE_ANON_KEY");

  if (!isConfigured) {
    console.info("Supabase n'est pas encore configure. Le contenu par defaut reste affiche.");
    return null;
  }

  return window.supabase.createClient(config.url, config.anonKey);
}

function loadCachedContent() {
  const cachedContent = readContentCache();
  applyContentMap(cachedContent);
}

async function loadSupabaseContent() {
  if (!supabaseClient) {
    return;
  }

  const { data, error } = await supabaseClient.from("site_content").select("key,value");

  if (error) {
    console.error("Impossible de charger le contenu Supabase.", error);
    return;
  }

  const content = Object.fromEntries(data.map((row) => [row.key, row.value]));
  writeContentCache(content);
  applyContentMap(content);
}

function applyContentMap(content) {
  Object.entries(content).forEach(([key, value]) => {
    const element = contentElements.get(key);

    if (element && typeof value === "string" && element.innerText !== value) {
      element.innerText = value;
    }
  });
}

function queueContentSave(contentKey, value) {
  const cachedContent = readContentCache();
  cachedContent[contentKey] = value;
  writeContentCache(cachedContent);

  clearTimeout(saveTimers.get(contentKey));
  saveTimers.set(
    contentKey,
    setTimeout(() => {
      saveContentToSupabase(contentKey, value);
    }, SAVE_DELAY)
  );
}

async function saveContentToSupabase(contentKey, value) {
  if (!supabaseClient) {
    showAdminError("Supabase n'est pas configure.");
    return;
  }

  const adminCode = sessionStorage.getItem(ADMIN_CODE_SESSION_KEY);

  if (!adminCode) {
    showAdminError("Reconnecte-toi au panel admin.");
    disableAdminMode();
    return;
  }

  const { error } = await supabaseClient.rpc("upsert_site_content", {
    p_key: contentKey,
    p_value: value,
    p_admin_code: adminCode,
  });

  if (error) {
    console.error("Erreur de sauvegarde Supabase.", error);
    showAdminError("Sauvegarde impossible dans Supabase.");
    return;
  }

  showAdminError("");
}

async function verifyAdminCode(adminCode) {
  if (!supabaseClient) {
    showAdminError("Configure Supabase avant d'utiliser le panel admin.");
    return false;
  }

  const { data, error } = await supabaseClient.rpc("verify_site_admin_code", {
    p_admin_code: adminCode,
  });

  if (error) {
    console.error("Verification admin impossible.", error);
    return false;
  }

  return data === true;
}

function subscribeToContentChanges() {
  const realtimeEnabled = window.VORTEX_SUPABASE && window.VORTEX_SUPABASE.realtime;

  if (!supabaseClient || !realtimeEnabled) {
    return;
  }

  supabaseClient
    .channel("site-content-sync")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "site_content" },
      (payload) => {
        const row = payload.new;

        if (!row || !row.key) {
          return;
        }

        const cachedContent = readContentCache();
        cachedContent[row.key] = row.value;
        writeContentCache(cachedContent);
        applyContentMap({ [row.key]: row.value });
      }
    )
    .subscribe();
}

function readContentCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeContentCache(content) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(content));
}

function openAdminModal() {
  if (!adminModal || !adminCodeInput) {
    return;
  }

  adminModal.classList.add("is-open");
  adminModal.setAttribute("aria-hidden", "false");
  adminCodeInput.value = "";
  showAdminError("");
  adminCodeInput.focus();
}

function closeAdminModal() {
  if (!adminModal) {
    return;
  }

  adminModal.classList.remove("is-open");
  adminModal.setAttribute("aria-hidden", "true");
}

function enableAdminMode() {
  document.body.classList.add("admin-active");

  editableElements.forEach((element) => {
    element.setAttribute("contenteditable", "true");
    element.setAttribute("spellcheck", "false");
  });

  if (adminToolbar) {
    adminToolbar.hidden = false;
  }

  if (memberAdminPanel) {
    memberAdminPanel.hidden = false;
  }

  renderRosters();
}

function disableAdminMode() {
  document.body.classList.remove("admin-active");

  editableElements.forEach((element) => {
    element.removeAttribute("contenteditable");
    element.removeAttribute("spellcheck");
  });

  if (adminToolbar) {
    adminToolbar.hidden = true;
  }

  if (memberAdminPanel) {
    memberAdminPanel.hidden = true;
  }

  hideMemberForm();
  renderRosters();
}

function isAdminActive() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function showAdminError(message) {
  if (adminError) {
    adminError.innerText = message;
  }
}

function closeMobileNav() {
  if (!nav || !navToggle) {
    return;
  }

  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function loadCachedRosters() {
  try {
    const cachedData = JSON.parse(localStorage.getItem(ROSTER_CACHE_KEY));

    if (cachedData) {
      rosters = cachedData.rosters || [];
      members = cachedData.members || [];
      renderRosters();
    }
  } catch {
    rosters = [];
    members = [];
  }
}

async function loadRosterData() {
  if (!supabaseClient) {
    seedDefaultRosterData();
    return;
  }

  const [{ data: rosterRows, error: rosterError }, { data: memberRows, error: memberError }] =
    await Promise.all([
      supabaseClient.from("site_rosters").select("*").order("sort_order").order("name"),
      supabaseClient.from("site_members").select("*").order("sort_order").order("name"),
    ]);

  if (rosterError || memberError) {
    console.error("Impossible de charger les rosters.", rosterError || memberError);
    seedDefaultRosterData();
    return;
  }

  rosters = rosterRows || [];
  members = memberRows || [];
  writeRosterCache();
  renderRosters();
}

function seedDefaultRosterData() {
  if (rosters.length > 0) {
    renderRosters();
    return;
  }

  rosters = [
    { id: -1, name: "Roster A", color: "#4cb8ff", sort_order: 0 },
    { id: -2, name: "Roster B", color: "#7de3ff", sort_order: 1 },
    { id: -3, name: "Roster C", color: "#ffc857", sort_order: 2 },
  ];
  members = [];
  renderRosters();
}

function renderRosters() {
  if (!rosterBoard) {
    return;
  }

  rosterBoard.innerHTML = "";
  updateRosterSelect();

  const sortedRosters = [...rosters].sort(sortByOrderThenName);

  sortedRosters.forEach((roster) => {
    const column = document.createElement("article");
    column.className = "roster-column";
    column.dataset.rosterId = roster.id;

    column.addEventListener("dragover", (event) => {
      if (!isAdminActive() || draggedMemberId === null) {
        return;
      }

      event.preventDefault();
      column.classList.add("is-drop-target");
    });

    column.addEventListener("dragleave", () => {
      column.classList.remove("is-drop-target");
    });

    column.addEventListener("drop", async (event) => {
      event.preventDefault();
      column.classList.remove("is-drop-target");

      if (!isAdminActive() || draggedMemberId === null) {
        return;
      }

      await moveMemberToRoster(draggedMemberId, Number(roster.id));
      draggedMemberId = null;
    });

    const rosterMembers = members
      .filter((member) => member.roster_id === roster.id)
      .sort(sortByOrderThenName);

    column.innerHTML = `
      <div class="roster-top">
        <div class="roster-title">
          <span class="roster-color" style="background:${escapeHtml(roster.color || "#4cb8ff")}"></span>
          <div>
            <strong>${escapeHtml(roster.name)}</strong>
            <span>${rosterMembers.length} membre${rosterMembers.length > 1 ? "s" : ""}</span>
          </div>
        </div>
        <div class="roster-actions">
          <button class="icon-button roster-add-member" type="button" title="Ajouter un membre">+</button>
          <button class="icon-button roster-edit" type="button" title="Modifier le roster">E</button>
          <button class="icon-button roster-delete" type="button" title="Supprimer le roster">x</button>
        </div>
      </div>
      <div class="member-list"></div>
    `;

    column.querySelector(".roster-add-member").addEventListener("click", () => showMemberForm({ rosterId: roster.id }));
    column.querySelector(".roster-edit").addEventListener("click", () => editRoster(roster));
    column.querySelector(".roster-delete").addEventListener("click", () => deleteRoster(roster.id));

    const memberList = column.querySelector(".member-list");

    if (rosterMembers.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-roster";
      empty.textContent = isAdminActive() ? "Glisse un membre ici ou ajoute-en un." : "Aucun membre pour le moment.";
      memberList.appendChild(empty);
    }

    rosterMembers.forEach((member) => {
      memberList.appendChild(createMemberCard(member, roster));
    });

    rosterBoard.appendChild(column);
  });
}

function createMemberCard(member, roster) {
  const card = document.createElement("article");
  card.className = "member-card";
  card.draggable = isAdminActive();
  card.dataset.memberId = member.id;
  card.style.borderLeftColor = roster.color || "#4cb8ff";

  card.innerHTML = `
    <div class="member-main">
      <strong class="member-name">${escapeHtml(member.name)}</strong>
      <div class="member-actions">
        <button class="icon-button member-edit" type="button" title="Modifier le membre">E</button>
        <button class="icon-button member-delete" type="button" title="Supprimer le membre">x</button>
      </div>
    </div>
    <div class="member-meta">
      ${member.role ? `<span>${escapeHtml(member.role)}</span>` : ""}
      ${member.level ? `<span>${escapeHtml(member.level)}</span>` : ""}
    </div>
  `;

  card.addEventListener("dragstart", (event) => {
    if (!isAdminActive()) {
      event.preventDefault();
      return;
    }

    draggedMemberId = Number(member.id);
    card.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("is-dragging");
    draggedMemberId = null;
  });

  card.querySelector(".member-edit").addEventListener("click", () => showMemberForm({ member }));
  card.querySelector(".member-delete").addEventListener("click", () => deleteMember(member.id));

  return card;
}

function updateRosterSelect() {
  if (!memberRosterSelect) {
    return;
  }

  memberRosterSelect.innerHTML = rosters
    .sort(sortByOrderThenName)
    .map((roster) => `<option value="${roster.id}">${escapeHtml(roster.name)}</option>`)
    .join("");
}

function showMemberForm({ member = null, rosterId = null } = {}) {
  if (!memberForm) {
    return;
  }

  memberForm.hidden = false;
  memberForm.elements["member-id"].value = member ? member.id : "";
  memberForm.elements["member-name"].value = member ? member.name : "";
  memberForm.elements["member-role"].value = member ? member.role || "" : "";
  memberForm.elements["member-level"].value = member ? member.level || "" : "";
  memberForm.elements["member-roster"].value = member ? member.roster_id : rosterId || rosters[0]?.id || "";
  memberForm.elements["member-name"].focus();
}

function hideMemberForm() {
  if (!memberForm) {
    return;
  }

  memberForm.reset();
  memberForm.hidden = true;
}

async function editRoster(roster) {
  const name = window.prompt("Nom du roster", roster.name);

  if (!name) {
    return;
  }

  const color = window.prompt("Couleur du roster", roster.color || "#4cb8ff") || roster.color;
  await saveRoster({ ...roster, name: name.trim(), color: color.trim() });
}

async function saveRoster(roster) {
  const adminCode = getAdminCodeOrStop();

  if (!adminCode || !supabaseClient) {
    return;
  }

  const { error } = await supabaseClient.rpc("upsert_site_roster", {
    p_id: roster.id && roster.id > 0 ? roster.id : null,
    p_name: roster.name,
    p_color: roster.color || "#4cb8ff",
    p_sort_order: roster.sort_order || 0,
    p_admin_code: adminCode,
  });

  if (error) {
    console.error("Sauvegarde roster impossible.", error);
    showAdminError("Sauvegarde roster impossible.");
    return;
  }

  await loadRosterData();
}

async function deleteRoster(rosterId) {
  if (!window.confirm("Supprimer ce roster et ses membres ?")) {
    return;
  }

  const adminCode = getAdminCodeOrStop();

  if (!adminCode || !supabaseClient) {
    return;
  }

  const { error } = await supabaseClient.rpc("delete_site_roster", {
    p_id: rosterId,
    p_admin_code: adminCode,
  });

  if (error) {
    console.error("Suppression roster impossible.", error);
    showAdminError("Suppression roster impossible.");
    return;
  }

  await loadRosterData();
}

async function saveMember(member) {
  const adminCode = getAdminCodeOrStop();

  if (!adminCode || !supabaseClient) {
    return;
  }

  const { error } = await supabaseClient.rpc("upsert_site_member", {
    p_id: member.id && member.id > 0 ? member.id : null,
    p_roster_id: member.roster_id,
    p_name: member.name,
    p_role: member.role,
    p_level: member.level,
    p_sort_order: member.sort_order || 0,
    p_admin_code: adminCode,
  });

  if (error) {
    console.error("Sauvegarde membre impossible.", error);
    showAdminError("Sauvegarde membre impossible.");
    return;
  }

  await loadRosterData();
}

async function deleteMember(memberId) {
  if (!window.confirm("Supprimer ce membre ?")) {
    return;
  }

  const adminCode = getAdminCodeOrStop();

  if (!adminCode || !supabaseClient) {
    return;
  }

  const { error } = await supabaseClient.rpc("delete_site_member", {
    p_id: memberId,
    p_admin_code: adminCode,
  });

  if (error) {
    console.error("Suppression membre impossible.", error);
    showAdminError("Suppression membre impossible.");
    return;
  }

  await loadRosterData();
}

async function moveMemberToRoster(memberId, rosterId) {
  const adminCode = getAdminCodeOrStop();

  if (!adminCode || !supabaseClient) {
    return;
  }

  const newOrder = members.filter((member) => member.roster_id === rosterId).length;
  const { error } = await supabaseClient.rpc("move_site_member", {
    p_member_id: memberId,
    p_roster_id: rosterId,
    p_sort_order: newOrder,
    p_admin_code: adminCode,
  });

  if (error) {
    console.error("Deplacement membre impossible.", error);
    showAdminError("Deplacement membre impossible.");
    return;
  }

  await loadRosterData();
}

function subscribeToRosterChanges() {
  const realtimeEnabled = window.VORTEX_SUPABASE && window.VORTEX_SUPABASE.realtime;

  if (!supabaseClient || !realtimeEnabled) {
    return;
  }

  supabaseClient
    .channel("site-roster-sync")
    .on("postgres_changes", { event: "*", schema: "public", table: "site_rosters" }, loadRosterData)
    .on("postgres_changes", { event: "*", schema: "public", table: "site_members" }, loadRosterData)
    .subscribe();
}

function writeRosterCache() {
  localStorage.setItem(ROSTER_CACHE_KEY, JSON.stringify({ rosters, members }));
}

function getAdminCodeOrStop() {
  const adminCode = sessionStorage.getItem(ADMIN_CODE_SESSION_KEY);

  if (!adminCode) {
    showAdminError("Reconnecte-toi au panel admin.");
    disableAdminMode();
    return "";
  }

  if (!supabaseClient) {
    showAdminError("Supabase n'est pas configure.");
    return "";
  }

  return adminCode;
}

function getMemberSortOrder(memberId) {
  return members.find((member) => member.id === memberId)?.sort_order || 0;
}

function sortByOrderThenName(a, b) {
  return (a.sort_order || 0) - (b.sort_order || 0) || String(a.name).localeCompare(String(b.name));
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
