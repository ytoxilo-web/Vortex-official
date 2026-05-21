const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const welcomeScreen = document.querySelector(".welcome-screen");
const welcomeContinue = document.querySelector(".welcome-continue");
const adminButton = document.querySelector(".admin-nav-button");
const adminModal = document.querySelector(".admin-modal");
const adminClose = document.querySelector(".admin-close");
const adminForm = document.querySelector(".admin-form");
const adminIdentityStep = document.querySelector(".admin-identity-step");
const adminCodeInput = document.querySelector("#admin-code");
const adminError = document.querySelector(".admin-error");
const adminToolbar = document.querySelector(".admin-toolbar");
const adminSaveStatus = document.querySelector(".admin-save-status");
const adminCounts = document.querySelector(".admin-counts");
const adminPanelOpen = document.querySelector(".admin-panel-open");
const adminPanelModal = document.querySelector(".admin-panel-modal");
const adminPanelClose = document.querySelector(".admin-panel-close");
const adminPanelSummary = document.querySelector(".admin-panel-summary");
const adminPermissionsSection = document.querySelector(".admin-permissions-section");
const adminPermissionsList = document.querySelector(".admin-permissions-list");
const adminLogList = document.querySelector(".admin-log-list");
const adminClearHistory = document.querySelector(".admin-clear-history");
const adminScrollTop = document.querySelector(".admin-scroll-top");
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
const ADMIN_NAME_SESSION_KEY = "vortex-admin-name";
const ADMIN_ROLE_SESSION_KEY = "vortex-admin-role";
const ADMIN_PERMISSIONS_SESSION_KEY = "vortex-admin-permissions";
const SAVE_DELAY = 450;
const PERMISSION_LABELS = {
  edit_content: "Modifier les textes",
  manage_rosters: "Gerer les rosters",
  manage_members: "Gerer les membres",
  view_history: "Voir l'historique",
  manage_permissions: "Gerer les permissions",
  clear_history: "Vider l'historique",
};

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
  (element) => !element.closest(".members") && !element.closest("[data-static]")
);
const contentElements = new Map();
const saveTimers = new Map();
const supabaseClient = createSupabaseClient();
let rosters = [];
let members = [];
let draggedMemberId = null;
let saveStatusTimer = null;
let pendingAdminCode = "";

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });
}

if (welcomeScreen && welcomeContinue) {
  welcomeContinue.focus();
  welcomeContinue.addEventListener("click", closeWelcomeScreen);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !welcomeScreen.classList.contains("is-hidden")) {
      closeWelcomeScreen();
    }
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
initRevealAnimation();

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

    pendingAdminCode = adminCodeInput.value.trim();
    showAdminError("");

    if (adminIdentityStep) {
      adminIdentityStep.hidden = false;
    }
  });
}

if (adminIdentityStep) {
  adminIdentityStep.querySelectorAll("[data-admin-name]").forEach((button) => {
    button.addEventListener("click", async () => {
      const adminName = button.dataset.adminName || "";
      const session = await verifyAdminIdentity(adminName, pendingAdminCode);

      if (!session) {
        showAdminError("Code incorrect pour cet admin.");
        return;
      }

      storeAdminSession(session, pendingAdminCode);
      closeAdminModal();
      enableAdminMode();
    });
  });
}

if (adminLogout) {
  adminLogout.addEventListener("click", () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_CODE_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_NAME_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_ROLE_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_PERMISSIONS_SESSION_KEY);
    disableAdminMode();
  });
}

if (adminPanelOpen) {
  adminPanelOpen.addEventListener("click", openAdminPanel);
}

if (adminPanelClose) {
  adminPanelClose.addEventListener("click", closeAdminPanel);
}

if (adminPanelModal) {
  adminPanelModal.addEventListener("click", (event) => {
    if (event.target === adminPanelModal) {
      closeAdminPanel();
    }
  });
}

if (adminClearHistory) {
  adminClearHistory.addEventListener("click", clearAdminHistory);
}

if (adminScrollTop) {
  adminScrollTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.addEventListener("keydown", (event) => {
  if (!event.ctrlKey || !event.shiftKey || event.key.toLowerCase() !== "a") {
    return;
  }

  const adminContext = getAdminContext();
  if (!adminContext.code || !adminContext.name) {
    return;
  }

  event.preventDefault();
  closeWelcomeScreen();
  enableAdminMode();
});

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
  setSaveStatus("Sauvegarde...", "saving");

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

  const adminContext = getAdminContext();

  if (!adminContext.code) {
    showAdminError("Reconnecte-toi au panel admin.");
    disableAdminMode();
    return;
  }

  if (!hasPermission("edit_content")) {
    showAdminError("Tu n'as pas la permission de modifier les textes.");
    setSaveStatus("Permission refusee", "error");
    return;
  }

  const { error } = await supabaseClient.rpc("upsert_site_content_admin", {
    p_key: contentKey,
    p_value: value,
    p_admin_name: adminContext.name,
    p_admin_code: adminContext.code,
  });

  if (error) {
    console.error("Erreur de sauvegarde Supabase.", error);
    showAdminError("Sauvegarde impossible dans Supabase.");
    setSaveStatus("Erreur de sauvegarde", "error");
    return;
  }

  showAdminError("");
  setSaveStatus("Sauvegarde terminee", "saved");
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

async function verifyAdminIdentity(adminName, adminCode) {
  if (!supabaseClient) {
    showAdminError("Configure Supabase avant d'utiliser le panel admin.");
    return null;
  }

  const { data, error } = await supabaseClient.rpc("get_site_admin_session", {
    p_admin_name: adminName,
    p_admin_code: adminCode,
  });

  if (error) {
    console.error("Verification admin impossible.", error);
    showAdminError("Verification admin impossible.");
    return null;
  }

  return data;
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
  pendingAdminCode = "";
  if (adminIdentityStep) {
    adminIdentityStep.hidden = true;
  }
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
    if (hasPermission("edit_content")) {
      element.setAttribute("contenteditable", "true");
      element.setAttribute("spellcheck", "false");
    } else {
      element.removeAttribute("contenteditable");
      element.removeAttribute("spellcheck");
    }
  });

  if (adminToolbar) {
    adminToolbar.hidden = false;
  }

  const modeLabel = document.querySelector(".admin-mode-label");
  const context = getAdminContext();
  if (modeLabel) {
    modeLabel.textContent = `${context.role === "owner" ? "Owner" : "Admin"}: ${context.name || "connecte"}`;
  }

  updateAdminCounts();
  setSaveStatus("Pret", "idle");

  if (memberAdminPanel) {
    memberAdminPanel.hidden = !(hasPermission("manage_rosters") || hasPermission("manage_members"));
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
  setSaveStatus("Pret", "idle");
  renderRosters();
}

function isAdminActive() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function storeAdminSession(session, adminCode) {
  sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
  sessionStorage.setItem(ADMIN_CODE_SESSION_KEY, adminCode);
  sessionStorage.setItem(ADMIN_NAME_SESSION_KEY, session.name || "");
  sessionStorage.setItem(ADMIN_ROLE_SESSION_KEY, session.role || "admin");
  sessionStorage.setItem(ADMIN_PERMISSIONS_SESSION_KEY, JSON.stringify(session.permissions || {}));
}

function getAdminContext() {
  return {
    name: sessionStorage.getItem(ADMIN_NAME_SESSION_KEY) || "",
    code: sessionStorage.getItem(ADMIN_CODE_SESSION_KEY) || "",
    role: sessionStorage.getItem(ADMIN_ROLE_SESSION_KEY) || "admin",
    permissions: readAdminPermissions(),
  };
}

function readAdminPermissions() {
  try {
    return JSON.parse(sessionStorage.getItem(ADMIN_PERMISSIONS_SESSION_KEY)) || {};
  } catch {
    return {};
  }
}

function hasPermission(permission) {
  const context = getAdminContext();
  return context.role === "owner" || context.permissions[permission] === true;
}

function showAdminError(message) {
  if (adminError) {
    adminError.innerText = message;
  }
}

function setSaveStatus(message, state = "idle") {
  if (!adminSaveStatus) {
    return;
  }

  clearTimeout(saveStatusTimer);
  adminSaveStatus.textContent = message;
  adminSaveStatus.classList.remove("is-saving", "is-saved", "is-error");

  if (state !== "idle") {
    adminSaveStatus.classList.add(`is-${state}`);
  }

  if (state === "saved") {
    saveStatusTimer = setTimeout(() => {
      adminSaveStatus.textContent = "Pret";
      adminSaveStatus.classList.remove("is-saved");
    }, 2200);
  }
}

function updateAdminCounts() {
  if (!adminCounts) {
    return;
  }

  const rosterLabel = `${rosters.length} roster${rosters.length > 1 ? "s" : ""}`;
  const memberLabel = `${members.length} membre${members.length > 1 ? "s" : ""}`;
  adminCounts.textContent = `${rosterLabel} - ${memberLabel}`;
}

function closeMobileNav() {
  if (!nav || !navToggle) {
    return;
  }

  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function closeWelcomeScreen() {
  if (!welcomeScreen) {
    return;
  }

  welcomeScreen.classList.add("is-hidden");
  welcomeScreen.setAttribute("aria-hidden", "true");
}

function initRevealAnimation() {
  const revealElements = document.querySelectorAll(
    ".notice, .section, .feature, .timeline article, .criteria, .community-grid article, .roster-column"
  );

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  revealElements.forEach((element) => element.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
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

  updateAdminCounts();
  rosterBoard.innerHTML = "";
  updateRosterSelect();

  const sortedRosters = [...rosters].sort(sortByOrderThenName);
  const canManageMembers = hasPermission("manage_members");
  const canManageRosters = hasPermission("manage_rosters");

  sortedRosters.forEach((roster) => {
    const column = document.createElement("article");
    column.className = "roster-column reveal is-visible";
    column.dataset.rosterId = roster.id;

    column.addEventListener("dragover", (event) => {
      if (!isAdminActive() || !hasPermission("manage_members") || draggedMemberId === null) {
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

      if (!isAdminActive() || !hasPermission("manage_members") || draggedMemberId === null) {
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
          ${canManageMembers ? '<button class="icon-button roster-add-member" type="button" title="Ajouter un membre">+</button>' : ""}
          ${canManageRosters ? '<button class="icon-button roster-edit" type="button" title="Modifier le roster">E</button>' : ""}
          ${canManageRosters ? '<button class="icon-button roster-delete" type="button" title="Supprimer le roster">x</button>' : ""}
        </div>
      </div>
      <div class="member-list"></div>
    `;

    column.querySelector(".roster-add-member")?.addEventListener("click", () => showMemberForm({ rosterId: roster.id }));
    column.querySelector(".roster-edit")?.addEventListener("click", () => editRoster(roster));
    column.querySelector(".roster-delete")?.addEventListener("click", () => deleteRoster(roster.id));

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
  const canManageMembers = hasPermission("manage_members");
  const card = document.createElement("article");
  card.className = "member-card";
  card.draggable = isAdminActive() && canManageMembers;
  card.dataset.memberId = member.id;
  card.style.borderLeftColor = roster.color || "#4cb8ff";

  card.innerHTML = `
    <div class="member-main">
      <strong class="member-name">${escapeHtml(member.name)}</strong>
      <div class="member-actions">
        ${canManageMembers ? '<button class="icon-button member-edit" type="button" title="Modifier le membre">E</button>' : ""}
        ${canManageMembers ? '<button class="icon-button member-delete" type="button" title="Supprimer le membre">x</button>' : ""}
      </div>
    </div>
    <div class="member-meta">
      ${member.role ? `<span>${escapeHtml(member.role)}</span>` : ""}
      ${member.level ? `<span>${escapeHtml(member.level)}</span>` : ""}
    </div>
  `;

  card.addEventListener("dragstart", (event) => {
    if (!isAdminActive() || !canManageMembers) {
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

  card.querySelector(".member-edit")?.addEventListener("click", () => showMemberForm({ member }));
  card.querySelector(".member-delete")?.addEventListener("click", () => deleteMember(member.id));

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
  const adminContext = getAdminCodeOrStop();

  if (!adminContext || !supabaseClient || !hasPermission("manage_rosters")) {
    return;
  }

  setSaveStatus("Sauvegarde...", "saving");

  const { error } = await supabaseClient.rpc("upsert_site_roster_admin", {
    p_id: roster.id && roster.id > 0 ? roster.id : null,
    p_name: roster.name,
    p_color: roster.color || "#4cb8ff",
    p_sort_order: roster.sort_order || 0,
    p_admin_name: adminContext.name,
    p_admin_code: adminContext.code,
  });

  if (error) {
    console.error("Sauvegarde roster impossible.", error);
    showAdminError("Sauvegarde roster impossible.");
    setSaveStatus("Erreur de sauvegarde", "error");
    return;
  }

  setSaveStatus("Sauvegarde terminee", "saved");
  await loadRosterData();
}

async function deleteRoster(rosterId) {
  if (!window.confirm("Supprimer ce roster et ses membres ?")) {
    return;
  }

  const adminContext = getAdminCodeOrStop();

  if (!adminContext || !supabaseClient || !hasPermission("manage_rosters")) {
    return;
  }

  setSaveStatus("Sauvegarde...", "saving");

  const { error } = await supabaseClient.rpc("delete_site_roster_admin", {
    p_id: rosterId,
    p_admin_name: adminContext.name,
    p_admin_code: adminContext.code,
  });

  if (error) {
    console.error("Suppression roster impossible.", error);
    showAdminError("Suppression roster impossible.");
    setSaveStatus("Erreur de sauvegarde", "error");
    return;
  }

  setSaveStatus("Sauvegarde terminee", "saved");
  await loadRosterData();
}

async function saveMember(member) {
  const adminContext = getAdminCodeOrStop();

  if (!adminContext || !supabaseClient || !hasPermission("manage_members")) {
    return;
  }

  setSaveStatus("Sauvegarde...", "saving");

  const { error } = await supabaseClient.rpc("upsert_site_member_admin", {
    p_id: member.id && member.id > 0 ? member.id : null,
    p_roster_id: member.roster_id,
    p_name: member.name,
    p_role: member.role,
    p_level: member.level,
    p_sort_order: member.sort_order || 0,
    p_admin_name: adminContext.name,
    p_admin_code: adminContext.code,
  });

  if (error) {
    console.error("Sauvegarde membre impossible.", error);
    showAdminError("Sauvegarde membre impossible.");
    setSaveStatus("Erreur de sauvegarde", "error");
    return;
  }

  setSaveStatus("Sauvegarde terminee", "saved");
  await loadRosterData();
}

async function deleteMember(memberId) {
  if (!window.confirm("Supprimer ce membre ?")) {
    return;
  }

  const adminContext = getAdminCodeOrStop();

  if (!adminContext || !supabaseClient || !hasPermission("manage_members")) {
    return;
  }

  setSaveStatus("Sauvegarde...", "saving");

  const { error } = await supabaseClient.rpc("delete_site_member_admin", {
    p_id: memberId,
    p_admin_name: adminContext.name,
    p_admin_code: adminContext.code,
  });

  if (error) {
    console.error("Suppression membre impossible.", error);
    showAdminError("Suppression membre impossible.");
    setSaveStatus("Erreur de sauvegarde", "error");
    return;
  }

  setSaveStatus("Sauvegarde terminee", "saved");
  await loadRosterData();
}

async function moveMemberToRoster(memberId, rosterId) {
  const adminContext = getAdminCodeOrStop();

  if (!adminContext || !supabaseClient || !hasPermission("manage_members")) {
    return;
  }

  setSaveStatus("Sauvegarde...", "saving");

  const newOrder = members.filter((member) => member.roster_id === rosterId).length;
  const { error } = await supabaseClient.rpc("move_site_member_admin", {
    p_member_id: memberId,
    p_roster_id: rosterId,
    p_sort_order: newOrder,
    p_admin_name: adminContext.name,
    p_admin_code: adminContext.code,
  });

  if (error) {
    console.error("Deplacement membre impossible.", error);
    showAdminError("Deplacement membre impossible.");
    setSaveStatus("Erreur de sauvegarde", "error");
    return;
  }

  setSaveStatus("Sauvegarde terminee", "saved");
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

async function openAdminPanel() {
  if (!adminPanelModal) {
    return;
  }

  adminPanelModal.classList.add("is-open");
  adminPanelModal.setAttribute("aria-hidden", "false");
  renderAdminPanelBase();
  await loadAdminPanelData();
}

function closeAdminPanel() {
  if (!adminPanelModal) {
    return;
  }

  adminPanelModal.classList.remove("is-open");
  adminPanelModal.setAttribute("aria-hidden", "true");
}

function renderAdminPanelBase() {
  const context = getAdminContext();

  if (adminPanelSummary) {
    adminPanelSummary.innerHTML = `
      <span>${escapeHtml(context.role === "owner" ? "Owner" : "Admin")} : ${escapeHtml(context.name || "-")}</span>
      <span>${rosters.length} roster${rosters.length > 1 ? "s" : ""}</span>
      <span>${members.length} membre${members.length > 1 ? "s" : ""}</span>
    `;
  }

  if (adminLogList) {
    adminLogList.innerHTML = hasPermission("view_history")
      ? "<p>Chargement de l'historique...</p>"
      : "<p>Tu n'as pas la permission de voir l'historique.</p>";
  }

  if (adminPermissionsSection) {
    adminPermissionsSection.hidden = !hasPermission("manage_permissions");
  }

  if (adminClearHistory) {
    adminClearHistory.hidden = !hasPermission("clear_history");
  }
}

async function loadAdminPanelData() {
  const context = getAdminContext();

  if (!supabaseClient || !context.name || !context.code) {
    return;
  }

  if (hasPermission("view_history")) {
    const { data, error } = await supabaseClient.rpc("get_site_admin_logs", {
      p_admin_name: context.name,
      p_admin_code: context.code,
    });

    if (error) {
      console.error("Historique admin impossible.", error);
      if (adminLogList) {
        adminLogList.innerHTML = "<p>Impossible de charger l'historique.</p>";
      }
    } else {
      renderAdminLogs(data || []);
    }
  }

  if (hasPermission("manage_permissions")) {
    const { data, error } = await supabaseClient.rpc("get_site_admin_users", {
      p_admin_name: context.name,
      p_admin_code: context.code,
    });

    if (error) {
      console.error("Permissions admin impossibles.", error);
      if (adminPermissionsList) {
        adminPermissionsList.innerHTML = "<p>Impossible de charger les permissions.</p>";
      }
    } else {
      renderAdminPermissions(data || []);
    }
  }
}

function renderAdminLogs(logs) {
  if (!adminLogList) {
    return;
  }

  if (logs.length === 0) {
    adminLogList.innerHTML = "<p>Aucune modification pour le moment.</p>";
    return;
  }

  adminLogList.innerHTML = logs
    .map((log) => {
      const date = new Date(log.created_at);
      return `
        <article class="admin-log-item">
          <strong>${escapeHtml(log.admin_name)}</strong>
          <span>${escapeHtml(formatAdminAction(log.action))} - ${escapeHtml(log.target || "-")}</span>
          <time datetime="${escapeHtml(log.created_at)}">${escapeHtml(date.toLocaleString("fr-FR"))}</time>
        </article>
      `;
    })
    .join("");
}

function renderAdminPermissions(admins) {
  if (!adminPermissionsList) {
    return;
  }

  adminPermissionsList.innerHTML = admins
    .map((admin) => {
      const isOwner = admin.role === "owner";
      const permissionInputs = Object.entries(PERMISSION_LABELS)
        .map(([key, label]) => {
          const checked = admin.role === "owner" || admin.permissions?.[key] === true ? "checked" : "";
          const disabled = isOwner ? "disabled" : "";
          return `
            <label>
              <input type="checkbox" data-permission="${escapeHtml(key)}" ${checked} ${disabled} />
              ${escapeHtml(label)}
            </label>
          `;
        })
        .join("");

      return `
        <article class="admin-permission-card" data-admin-name="${escapeHtml(admin.name)}">
          <div class="admin-permission-top">
            <strong>${escapeHtml(admin.name)} (${escapeHtml(admin.role)})</strong>
            <label class="admin-active-toggle">
              <input type="checkbox" data-active ${admin.is_active ? "checked" : ""} ${isOwner ? "disabled" : ""} />
              Actif
            </label>
          </div>
          <div class="admin-permission-grid">${permissionInputs}</div>
          ${isOwner ? "" : '<button class="button compact save-admin-permissions" type="button">Sauvegarder les permissions</button>'}
        </article>
      `;
    })
    .join("");

  adminPermissionsList.querySelectorAll(".save-admin-permissions").forEach((button) => {
    button.addEventListener("click", () => saveAdminPermissions(button.closest(".admin-permission-card")));
  });
}

async function saveAdminPermissions(card) {
  if (!card || !supabaseClient) {
    return;
  }

  const context = getAdminContext();
  const permissions = {};

  card.querySelectorAll("[data-permission]").forEach((input) => {
    permissions[input.dataset.permission] = input.checked;
  });

  const { error } = await supabaseClient.rpc("update_site_admin_permissions", {
    p_owner_name: context.name,
    p_owner_code: context.code,
    p_target_admin_name: card.dataset.adminName,
    p_permissions: permissions,
    p_is_active: card.querySelector("[data-active]")?.checked === true,
  });

  if (error) {
    console.error("Sauvegarde permissions impossible.", error);
    setSaveStatus("Erreur permissions", "error");
    return;
  }

  setSaveStatus("Permissions sauvegardees", "saved");
  await loadAdminPanelData();
}

async function clearAdminHistory() {
  if (!window.confirm("Vider l'historique admin ? Cette action sera elle-meme enregistree.")) {
    return;
  }

  const context = getAdminContext();
  const { error } = await supabaseClient.rpc("clear_site_admin_logs", {
    p_owner_name: context.name,
    p_owner_code: context.code,
  });

  if (error) {
    console.error("Suppression historique impossible.", error);
    setSaveStatus("Erreur historique", "error");
    return;
  }

  setSaveStatus("Historique vide", "saved");
  await loadAdminPanelData();
}

function getAdminCodeOrStop() {
  const adminContext = getAdminContext();

  if (!adminContext.code || !adminContext.name) {
    showAdminError("Reconnecte-toi au panel admin.");
    disableAdminMode();
    return null;
  }

  if (!supabaseClient) {
    showAdminError("Supabase n'est pas configure.");
    return null;
  }

  return adminContext;
}

function getMemberSortOrder(memberId) {
  return members.find((member) => member.id === memberId)?.sort_order || 0;
}

function sortByOrderThenName(a, b) {
  return (a.sort_order || 0) - (b.sort_order || 0) || String(a.name).localeCompare(String(b.name));
}

function formatAdminAction(action) {
  const labels = {
    edit_content: "Texte modifie",
    create_roster: "Roster cree",
    edit_roster: "Roster modifie",
    delete_roster: "Roster supprime",
    create_member: "Membre ajoute",
    edit_member: "Membre modifie",
    delete_member: "Membre supprime",
    move_member: "Membre deplace",
    update_permissions: "Permissions modifiees",
    clear_history: "Historique vide",
  };

  return labels[action] || action;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
