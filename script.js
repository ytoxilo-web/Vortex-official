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
const adminCreateForm = document.querySelector(".admin-create-form");
const adminAnnouncementsSection = document.querySelector(".admin-announcements-section");
const adminBannerForm = document.querySelector(".admin-banner-form");
const adminBannerList = document.querySelector(".admin-banner-list");
const adminBackupsSection = document.querySelector(".admin-backups-section");
const adminCreateBackup = document.querySelector(".admin-create-backup");
const adminBackupList = document.querySelector(".admin-backup-list");
const adminSectionsSection = document.querySelector(".admin-sections-section");
const adminSectionForm = document.querySelector(".admin-section-form");
const adminSectionList = document.querySelector(".admin-section-list");
const adminMembersSection = document.querySelector(".admin-members-section");
const adminMemberCreateForm = document.querySelector(".admin-member-create-form");
const adminMemberList = document.querySelector(".admin-member-list");
const adminLogList = document.querySelector(".admin-log-list");
const adminLogFilter = document.querySelector(".admin-log-filter");
const adminClearHistory = document.querySelector(".admin-clear-history");
const adminScrollTop = document.querySelector(".admin-scroll-top");
const adminLogout = document.querySelector(".admin-logout");
const rosterBoard = document.querySelector(".roster-board");
const customSections = document.querySelector(".custom-sections");
const publicBannerZone = document.querySelector(".public-banner-zone");
const memberAdminPanel = document.querySelector(".member-admin-panel");
const addRosterButton = document.querySelector(".add-roster-button");
const memberForm = document.querySelector(".member-form");
const cancelMemberEdit = document.querySelector(".cancel-member-edit");
const memberRosterSelect = document.querySelector('[name="member-roster"]');
const discordConnectButton = document.querySelector(".discord-connect");
const discordSyncButton = document.querySelector(".discord-sync");
const discordLogoutButton = document.querySelector(".discord-logout");
const discordRoleStatus = document.querySelector(".discord-role-status");
const privateRosterLinks = document.querySelectorAll(".private-roster-link");
const rosterPanelModal = document.querySelector(".roster-panel-modal");
const rosterPanelClose = document.querySelector(".roster-panel-close");
const rosterPanelTitle = document.querySelector("#roster-panel-title");
const rosterPanelSubtitle = document.querySelector(".roster-panel-subtitle");
const rosterPanelContent = document.querySelector(".roster-panel-content");
const rosterPanelTabs = document.querySelectorAll("[data-roster-tab]");
const rosterConfigToggle = document.querySelector(".roster-config-toggle");
const rosterConfigPanel = document.querySelector(".roster-config-panel");
const rosterConfigCancel = document.querySelector(".roster-config-cancel");
const legacyPrivateRosterSections = document.querySelectorAll(".private-roster-section");

const CACHE_KEY = "vortex-site-content-cache";
const ROSTER_CACHE_KEY = "vortex-roster-cache";
const ADMIN_SESSION_KEY = "vortex-admin-active";
const ADMIN_CODE_SESSION_KEY = "vortex-admin-code";
const ADMIN_NAME_SESSION_KEY = "vortex-admin-name";
const ADMIN_ROLE_SESSION_KEY = "vortex-admin-role";
const ADMIN_PERMISSIONS_SESSION_KEY = "vortex-admin-permissions";
const ADMIN_SESSION_VERSION_KEY = "vortex-admin-session-version";
const ADMIN_AUTH_MODE_SESSION_KEY = "vortex-admin-auth-mode";
const SAVE_DELAY = 450;
const PERMISSION_LABELS = {
  edit_content: "✏️ Modifier les textes",
  manage_rosters: "📋 Gerer les rosters",
  manage_members: "👤 Gerer les membres",
  move_members: "➡️ Deplacer les membres",
  view_history: "🕒 Voir l'historique",
  manage_permissions: "🔐 Gerer les permissions",
  clear_history: "🧹 Vider l'historique",
  manage_admins: "🛡️ Gerer les admins",
  manage_roster_managers: "🎯 Gerer responsables roster",
  manage_announcements: "📣 Annonces internes",
  manage_backups: "💾 Backups/restauration",
  manage_staff: "⭐ Gerer le staff",
  manage_sections: "🧩 Gerer les sections",
  force_logout: "🚪 Forcer deconnexion",
};
const OWNER_PERMISSIONS = Object.fromEntries(Object.keys(PERMISSION_LABELS).map((key) => [key, true]));

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
let siteSections = [];
let publicBanners = [];
let draggedMemberId = null;
let saveStatusTimer = null;
let pendingAdminCode = "";
let currentDiscordProfile = null;
let currentRosterPanelKey = "";
let currentRosterPanelTab = "overview";

const ROSTER_PANEL_STORAGE_KEY = "vortex-private-roster-panels";
const ROSTER_PANEL_CONFIG = {
  a: { title: "Roster A", roleKey: "roster_a", accent: "#4cb8ff" },
  b: { title: "Roster B", roleKey: "roster_b", accent: "#7de3ff" },
  c: { title: "Roster C", roleKey: "roster_c", accent: "#ffc857" },
};
const defaultRosterPanels = {
  a: {
    announcement: "Briefing Roster A a completer par les owners.",
    scrim: "Aucun scrim planifie.",
    event: "Aucun evenement planifie.",
  },
  b: {
    announcement: "Briefing Roster B a completer par les owners.",
    scrim: "Aucun scrim planifie.",
    event: "Aucun evenement planifie.",
  },
  c: {
    announcement: "Briefing Roster C a completer par les owners.",
    scrim: "Aucun scrim planifie.",
    event: "Aucun evenement planifie.",
  },
};

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
loadSiteSections();
loadPublicBanners();
subscribeToContentChanges();
subscribeToRosterChanges();
initRevealAnimation();
initDiscordAuth();
removeLegacyRosterSections();

if (adminButton) {
  adminButton.addEventListener("click", () => {
    closeMobileNav();

    if (isAdminActive()) {
      enableAdminMode();
      return;
    }

    if (isRosterOwner()) {
      storeDiscordOwnerAdminSession();
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

if (adminLogout) {
  adminLogout.addEventListener("click", () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_CODE_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_NAME_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_ROLE_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_PERMISSIONS_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_VERSION_KEY);
    sessionStorage.removeItem(ADMIN_AUTH_MODE_SESSION_KEY);
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

if (adminLogFilter) {
  adminLogFilter.addEventListener("change", loadAdminPanelData);
}

if (adminCreateForm) {
  adminCreateForm.addEventListener("submit", createAdminFromPanel);
}

if (adminBannerForm) {
  adminBannerForm.addEventListener("submit", createPublicBannerFromPanel);
}

if (adminCreateBackup) {
  adminCreateBackup.addEventListener("click", createContentBackup);
}

if (adminSectionForm) {
  adminSectionForm.addEventListener("submit", createSiteSectionFromPanel);
}

if (adminMemberCreateForm) {
  adminMemberCreateForm.addEventListener("submit", createMemberFromPanel);
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
      profile_url: normalizeMemberUrl(formData.get("member-link") || ""),
      sort_order: memberId ? getMemberSortOrder(Number(memberId)) : rosterMembers.length,
    });

    hideMemberForm();
  });
}

if (cancelMemberEdit) {
  cancelMemberEdit.addEventListener("click", hideMemberForm);
}

if (discordConnectButton) {
  discordConnectButton.addEventListener("click", startDiscordLogin);
}

if (discordSyncButton) {
  discordSyncButton.addEventListener("click", syncDiscordRoles);
}

if (discordLogoutButton) {
  discordLogoutButton.addEventListener("click", signOutDiscord);
}

privateRosterLinks.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openRosterPanel(button.dataset.rosterKey || getRosterKeyFromRole(button.dataset.rosterRole || ""));
  });
});

if (rosterPanelClose) {
  rosterPanelClose.addEventListener("click", closeRosterPanel);
}

if (rosterPanelModal) {
  rosterPanelModal.addEventListener("click", (event) => {
    if (event.target === rosterPanelModal) {
      closeRosterPanel();
    }
  });
}

rosterPanelTabs.forEach((button) => {
  button.addEventListener("click", () => {
    currentRosterPanelTab = button.dataset.rosterTab || "overview";
    renderRosterPanel();
  });
});

if (rosterConfigToggle) {
  rosterConfigToggle.addEventListener("click", () => {
    if (!rosterConfigPanel || !isRosterOwner()) {
      if (rosterConfigPanel) {
        rosterConfigPanel.hidden = true;
      }
      return;
    }

    rosterConfigPanel.hidden = !rosterConfigPanel.hidden;
    fillRosterConfigForm();
  });
}

if (rosterConfigCancel) {
  rosterConfigCancel.addEventListener("click", () => {
    if (rosterConfigPanel) {
      rosterConfigPanel.hidden = true;
    }
  });
}

if (rosterConfigPanel) {
  rosterConfigPanel.addEventListener("submit", (event) => {
    event.preventDefault();
    saveRosterPanelConfig();
  });
}

if (isAdminActive()) {
  enableAdminMode();
}

setInterval(checkAdminSessionStillValid, 30000);

async function initDiscordAuth() {
  if (!discordRoleStatus) {
    return;
  }

  if (!supabaseClient || !supabaseClient.auth) {
    renderDiscordStatus(null, null, "Supabase doit etre configure pour verifier les roles Discord.");
    return;
  }

  const { data } = await supabaseClient.auth.getSession();
  await handleDiscordSession(data.session || null);

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    handleDiscordSession(session || null);
  });
}

async function handleDiscordSession(session) {
  if (!session) {
    currentDiscordProfile = null;
    updatePrivateRosterAccess(null);
    renderDiscordStatus(null, null, "Non connecte.");
    return;
  }

  const profile = await loadDiscordProfile();
  currentDiscordProfile = profile;
  updatePrivateRosterAccess(profile);
  renderDiscordStatus(session.user, profile);

  if (!profile) {
    await syncDiscordRoles();
  }
}

async function startDiscordLogin() {
  if (!supabaseClient || !supabaseClient.auth) {
    renderDiscordStatus(null, null, "Supabase n'est pas configure.");
    return;
  }

  setDiscordStatusText("Redirection vers Discord...");
  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo,
      scopes: "identify",
    },
  });

  if (error) {
    console.error("Connexion Discord impossible.", error);
    setDiscordStatusText("Connexion Discord impossible.");
  }
}

async function syncDiscordRoles() {
  if (!supabaseClient || !supabaseClient.auth) {
    setDiscordStatusText("Supabase n'est pas configure.");
    return;
  }

  const { data: sessionData } = await supabaseClient.auth.getSession();

  if (!sessionData.session) {
    await startDiscordLogin();
    return;
  }

  setDiscordStatusText("Verification des roles Discord...");
  const { data, error } = await supabaseClient.functions.invoke("sync-discord-roles", {
    method: "POST",
  });

  if (error) {
    console.error("Synchronisation Discord impossible.", error);
    setDiscordStatusText("Impossible de verifier les roles Discord.");
    return;
  }

  currentDiscordProfile = data?.profile || null;
  updatePrivateRosterAccess(currentDiscordProfile);
  renderDiscordStatus(sessionData.session.user, currentDiscordProfile);
}

async function signOutDiscord() {
  if (!supabaseClient || !supabaseClient.auth) {
    return;
  }

  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_CODE_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_NAME_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_ROLE_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_PERMISSIONS_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_SESSION_VERSION_KEY);
  sessionStorage.removeItem(ADMIN_AUTH_MODE_SESSION_KEY);
  disableAdminMode();
  await supabaseClient.auth.signOut();
  renderDiscordStatus(null, null, "Deconnecte.");
}

async function loadDiscordProfile() {
  if (!supabaseClient) {
    return null;
  }

  const { data, error } = await supabaseClient
    .from("discord_profiles")
    .select("discord_user_id, username, avatar_url, is_server_member, role_names, matched_role_keys, synced_at")
    .maybeSingle();

  if (error) {
    console.error("Profil Discord impossible a charger.", error);
    return null;
  }

  return data || null;
}

function renderDiscordStatus(user, profile, fallbackMessage = "") {
  const isConnected = Boolean(user);

  if (discordConnectButton) {
    discordConnectButton.hidden = isConnected;
  }

  if (discordSyncButton) {
    discordSyncButton.hidden = !isConnected;
  }

  if (discordLogoutButton) {
    discordLogoutButton.hidden = !isConnected;
  }

  if (!discordRoleStatus) {
    return;
  }

  if (!isConnected) {
    discordRoleStatus.textContent = fallbackMessage || "Non connecte.";
    discordRoleStatus.classList.remove("is-success", "is-warning");
    return;
  }

  if (!profile) {
    discordRoleStatus.textContent = "Compte Discord connecte. Roles pas encore synchronises.";
    discordRoleStatus.classList.remove("is-success");
    discordRoleStatus.classList.add("is-warning");
    return;
  }

  if (!profile.is_server_member) {
    discordRoleStatus.textContent = "Compte Discord connecte, mais ce compte n'est pas detecte sur le serveur VTX.";
    discordRoleStatus.classList.remove("is-success");
    discordRoleStatus.classList.add("is-warning");
    return;
  }

  const roles = profile.role_names?.length ? profile.role_names : profile.matched_role_keys || [];
  const syncedAt = profile.synced_at ? new Date(profile.synced_at).toLocaleString("fr-FR") : "";
  discordRoleStatus.innerHTML = `
    <span>Connecte : ${escapeHtml(profile.username || "Discord")}</span>
    <span>Roles : ${roles.length ? roles.map(escapeHtml).join(", ") : "aucun role public detecte"}</span>
    ${syncedAt ? `<small>Derniere verification : ${escapeHtml(syncedAt)}</small>` : ""}
  `;
  discordRoleStatus.classList.add("is-success");
  discordRoleStatus.classList.remove("is-warning");
}

function updatePrivateRosterAccess(profile) {
  const roleKeys = new Set(profile?.matched_role_keys || []);
  const hasOwnerAccess = roleKeys.has("owner");

  privateRosterLinks.forEach((link) => {
    const roleKey = link.dataset.rosterRole;
    link.hidden = !roleKey || !(roleKeys.has(roleKey) || hasOwnerAccess);
  });

  if (currentRosterPanelKey && !canAccessRosterPanel(currentRosterPanelKey)) {
    closeRosterPanel();
    setDiscordStatusText("Connecte-toi avec le role Discord du roster pour acceder a cet espace.");
    discordRoleStatus?.classList.add("is-warning");
  }
}

function canAccessRosterPanel(rosterKey) {
  const config = ROSTER_PANEL_CONFIG[rosterKey];
  const roleKeys = new Set(currentDiscordProfile?.matched_role_keys || []);
  return Boolean(config && (roleKeys.has(config.roleKey) || roleKeys.has("owner")));
}

function getRosterKeyFromRole(roleKey) {
  return Object.entries(ROSTER_PANEL_CONFIG).find(([, config]) => config.roleKey === roleKey)?.[0] || "";
}

function removeLegacyRosterSections() {
  legacyPrivateRosterSections.forEach((section) => {
    section.remove();
  });
}

function isRosterOwner() {
  return Array.isArray(currentDiscordProfile?.matched_role_keys) && currentDiscordProfile.matched_role_keys.includes("owner");
}

function openRosterPanel(rosterKey) {
  if (!canAccessRosterPanel(rosterKey)) {
    setDiscordStatusText("Tu n'as pas le role Discord requis pour ce roster.");
    discordRoleStatus?.classList.add("is-warning");
    return;
  }

  currentRosterPanelKey = rosterKey;
  currentRosterPanelTab = "overview";

  if (rosterPanelModal) {
    rosterPanelModal.classList.add("is-open");
    rosterPanelModal.setAttribute("aria-hidden", "false");
  }

  if (rosterConfigPanel) {
    rosterConfigPanel.hidden = true;
  }

  renderRosterPanel();
}

function closeRosterPanel() {
  if (!rosterPanelModal) {
    return;
  }

  rosterPanelModal.classList.remove("is-open");
  rosterPanelModal.setAttribute("aria-hidden", "true");
  currentRosterPanelKey = "";
}

function renderRosterPanel() {
  const config = ROSTER_PANEL_CONFIG[currentRosterPanelKey];

  if (!config || !rosterPanelContent) {
    return;
  }

  const data = readRosterPanelData()[currentRosterPanelKey] || defaultRosterPanels[currentRosterPanelKey];
  const rosterMembers = getRosterMembersForPanel(config.title);

  if (rosterPanelTitle) {
    rosterPanelTitle.textContent = config.title;
  }

  if (rosterPanelSubtitle) {
    rosterPanelSubtitle.textContent = `${rosterMembers.length} membre${rosterMembers.length > 1 ? "s" : ""} detecte${rosterMembers.length > 1 ? "s" : ""} dans ${config.title}.`;
  }

  if (rosterPanelModal) {
    rosterPanelModal.style.setProperty("--roster-accent", config.accent);
  }

  if (rosterConfigToggle) {
    rosterConfigToggle.hidden = !isRosterOwner();
  }

  if (rosterConfigPanel && !isRosterOwner()) {
    rosterConfigPanel.hidden = true;
  }

  rosterPanelTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.rosterTab === currentRosterPanelTab);
  });

  rosterPanelContent.innerHTML = getRosterPanelMarkup(currentRosterPanelTab, config, data, rosterMembers);
}

function getRosterPanelMarkup(tab, config, data, rosterMembers) {
  const memberCards = rosterMembers.length
    ? rosterMembers
        .map(
          (member) => `
            <article class="roster-panel-member">
              <strong>${escapeHtml(member.name)}</strong>
              <span>${escapeHtml([member.role, member.level].filter(Boolean).join(" - ") || "Membre roster")}</span>
            </article>
          `
        )
        .join("")
    : '<p class="roster-panel-empty">Aucun membre charge pour ce roster.</p>';

  const panels = {
    overview: `
      <div class="roster-panel-layout">
        <article class="roster-panel-feature">
          <span>Annonce</span>
          <strong>${escapeHtml(data.announcement)}</strong>
        </article>
        <article class="roster-panel-feature">
          <span>Prochain scrim</span>
          <strong>${escapeHtml(data.scrim)}</strong>
        </article>
        <article class="roster-panel-feature">
          <span>Evenement</span>
          <strong>${escapeHtml(data.event)}</strong>
        </article>
      </div>
      <div class="roster-panel-section-grid">
        <section>
          <h3>Membres ${escapeHtml(config.title)}</h3>
          <div class="roster-panel-members">${memberCards}</div>
        </section>
        <section>
          <h3>Priorites</h3>
          <ul class="roster-panel-list">
            <li>Confirmer les disponibilites avant chaque scrim.</li>
            <li>Centraliser les compos et retours importants.</li>
            <li>Garder les annonces roster au meme endroit.</li>
          </ul>
        </section>
      </div>
    `,
    scrims: `
      <section class="roster-panel-wide">
        <h3>Scrims</h3>
        <article class="roster-panel-entry">
          <strong>${escapeHtml(data.scrim)}</strong>
          <p>Ajoute ici l'adversaire, l'heure, les maps, les bans et le lien vocal.</p>
        </article>
      </section>
    `,
    announcements: `
      <section class="roster-panel-wide">
        <h3>Annonces</h3>
        <article class="roster-panel-entry">
          <strong>${escapeHtml(data.announcement)}</strong>
          <p>Message important visible uniquement pour les membres autorises du roster.</p>
        </article>
      </section>
    `,
    events: `
      <section class="roster-panel-wide">
        <h3>Evenements</h3>
        <article class="roster-panel-entry">
          <strong>${escapeHtml(data.event)}</strong>
          <p>Ajoute ici les tournois, reunions, deadlines ou rendez-vous du roster.</p>
        </article>
      </section>
    `,
  };

  return panels[tab] || panels.overview;
}

function fillRosterConfigForm() {
  if (!rosterConfigPanel || !currentRosterPanelKey) {
    return;
  }

  const data = readRosterPanelData()[currentRosterPanelKey] || defaultRosterPanels[currentRosterPanelKey];
  rosterConfigPanel.elements.announcement.value = data.announcement || "";
  rosterConfigPanel.elements.scrim.value = data.scrim || "";
  rosterConfigPanel.elements.event.value = data.event || "";
}

function saveRosterPanelConfig() {
  if (!isRosterOwner() || !rosterConfigPanel || !currentRosterPanelKey) {
    if (rosterConfigPanel) {
      rosterConfigPanel.hidden = true;
    }
    return;
  }

  const allData = readRosterPanelData();
  allData[currentRosterPanelKey] = {
    announcement: rosterConfigPanel.elements.announcement.value.trim() || "Aucune annonce.",
    scrim: rosterConfigPanel.elements.scrim.value.trim() || "Aucun scrim planifie.",
    event: rosterConfigPanel.elements.event.value.trim() || "Aucun evenement planifie.",
  };
  localStorage.setItem(ROSTER_PANEL_STORAGE_KEY, JSON.stringify(allData));
  rosterConfigPanel.hidden = true;
  renderRosterPanel();
}

function readRosterPanelData() {
  try {
    return {
      ...defaultRosterPanels,
      ...(JSON.parse(localStorage.getItem(ROSTER_PANEL_STORAGE_KEY)) || {}),
    };
  } catch {
    return { ...defaultRosterPanels };
  }
}

function getRosterMembersForPanel(rosterTitle) {
  const roster = rosters.find((item) => String(item.name).toLowerCase() === rosterTitle.toLowerCase());

  if (!roster) {
    return [];
  }

  return members.filter((member) => member.roster_id === roster.id).sort(sortByOrderThenName);
}

function setDiscordStatusText(message) {
  if (!discordRoleStatus) {
    return;
  }

  discordRoleStatus.textContent = message;
  discordRoleStatus.classList.remove("is-success", "is-warning");
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

async function loadAdminIdentityButtons() {
  if (!adminIdentityStep) {
    return;
  }

  const buttonWrap = adminIdentityStep.querySelector(".admin-identity-buttons");

  if (!buttonWrap) {
    return;
  }

  let adminNames = ["Ayoub", "Malo", "Quentin"];

  if (supabaseClient) {
    const { data, error } = await supabaseClient.rpc("get_site_admin_names");

    if (!error && data?.length) {
      adminNames = data.map((item) => item.name);
    }
  }

  buttonWrap.innerHTML = adminNames
    .map((name) => `<button type="button" data-admin-name="${escapeHtml(name)}">${escapeHtml(name)}</button>`)
    .join("");

  buttonWrap.querySelectorAll("[data-admin-name]").forEach((button) => {
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
  loadAdminIdentityButtons();
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
    modeLabel.textContent = context.role === "owner" ? "👑" : "🛡️";
    modeLabel.title = `${context.role === "owner" ? "Owner" : "Admin"}: ${context.name || "connecte"}`;
    modeLabel.setAttribute("aria-label", modeLabel.title);
  }

  updateAdminCounts();
  setSaveStatus("Pret", "idle");

  if (memberAdminPanel) {
    memberAdminPanel.hidden = !(hasPermission("manage_rosters") || hasPermission("manage_members"));
  }

  renderRosters();
  applySectionVisibility();
  renderCustomSections();
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
  applySectionVisibility();
  renderCustomSections();
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
  sessionStorage.setItem(ADMIN_SESSION_VERSION_KEY, String(session.session_version || 1));
  sessionStorage.setItem(ADMIN_AUTH_MODE_SESSION_KEY, "code");
}

function storeDiscordOwnerAdminSession() {
  sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
  sessionStorage.setItem(ADMIN_CODE_SESSION_KEY, "__discord_owner__");
  sessionStorage.setItem(ADMIN_NAME_SESSION_KEY, currentDiscordProfile?.username || "Discord owner");
  sessionStorage.setItem(ADMIN_ROLE_SESSION_KEY, "owner");
  sessionStorage.setItem(ADMIN_PERMISSIONS_SESSION_KEY, JSON.stringify(OWNER_PERMISSIONS));
  sessionStorage.setItem(ADMIN_SESSION_VERSION_KEY, "1");
  sessionStorage.setItem(ADMIN_AUTH_MODE_SESSION_KEY, "discord_owner");
}

function getAdminContext() {
  return {
    name: sessionStorage.getItem(ADMIN_NAME_SESSION_KEY) || "",
    code: sessionStorage.getItem(ADMIN_CODE_SESSION_KEY) || "",
    role: sessionStorage.getItem(ADMIN_ROLE_SESSION_KEY) || "admin",
    permissions: readAdminPermissions(),
    sessionVersion: Number(sessionStorage.getItem(ADMIN_SESSION_VERSION_KEY) || 1),
    authMode: sessionStorage.getItem(ADMIN_AUTH_MODE_SESSION_KEY) || "code",
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
  if (context.role === "manager_roster" && permission === "move_members") {
    return true;
  }
  return context.role === "owner" || context.permissions[permission] === true;
}

async function checkAdminSessionStillValid() {
  if (!isAdminActive() || !supabaseClient) {
    return;
  }

  const context = getAdminContext();

  if (!context.name || !context.code) {
    return;
  }

  if (context.authMode === "discord_owner") {
    const profile = await loadDiscordProfile();
    currentDiscordProfile = profile;

    if (!profile?.matched_role_keys?.includes("owner")) {
      clearAdminSession();
      disableAdminMode();
      showAdminError("Role owner Discord requis.");
    }

    return;
  }

  const session = await verifyAdminIdentity(context.name, context.code);

  if (!session || Number(session.session_version || 1) !== context.sessionVersion) {
    clearAdminSession();
    disableAdminMode();
    showAdminError("Session admin expiree.");
  }
}

function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_CODE_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_NAME_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_ROLE_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_PERMISSIONS_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_SESSION_VERSION_KEY);
  sessionStorage.removeItem(ADMIN_AUTH_MODE_SESSION_KEY);
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
  adminSaveStatus.textContent = formatAdminStatus(message, state);
  adminSaveStatus.classList.remove("is-saving", "is-saved", "is-error");

  if (state !== "idle") {
    adminSaveStatus.classList.add(`is-${state}`);
  }

  if (state === "saved") {
    saveStatusTimer = setTimeout(() => {
      adminSaveStatus.textContent = formatAdminStatus("Pret", "idle");
      adminSaveStatus.classList.remove("is-saved");
    }, 2200);
  }
}

function formatAdminStatus(message, state) {
  const icons = {
    idle: "⚪",
    saving: "🟡",
    saved: "✅",
    error: "❌",
  };

  return `${icons[state] || icons.idle} ${message}`;
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
  if (adminMembersSection && !adminMembersSection.hidden) {
    renderPanelMemberTools();
  }
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
  if (adminMembersSection && !adminMembersSection.hidden) {
    renderPanelMemberTools();
  }
}

async function loadSiteSections() {
  if (!supabaseClient) {
    return;
  }

  const { data, error } = await supabaseClient.from("site_sections").select("*").order("sort_order").order("label");

  if (error) {
    console.error("Impossible de charger les sections du site.", error);
    return;
  }

  siteSections = data || [];
  applySectionVisibility();
  renderCustomSections();
  renderAdminSections();
}

async function loadPublicBanners() {
  if (!supabaseClient) {
    return;
  }

  const { data, error } = await supabaseClient
    .from("site_public_banners")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Impossible de charger les bandelettes.", error);
    return;
  }

  publicBanners = data || [];
  renderPublicBanners();
  renderAdminBanners();
}

function renderPublicBanners() {
  if (!publicBannerZone) {
    return;
  }

  const activeBanners = publicBanners.filter((banner) => banner.is_active);

  publicBannerZone.innerHTML = activeBanners
    .map(
      (banner) => `
        <div class="public-banner" style="--banner-color:${escapeHtml(banner.color || "#ffc857")}">
          <strong>${escapeHtml(banner.title)}</strong>
        </div>
      `
    )
    .join("");
}

function renderAdminBanners() {
  if (!adminBannerList || !hasPermission("manage_announcements")) {
    return;
  }

  if (publicBanners.length === 0) {
    adminBannerList.innerHTML = "<p>Aucune bandelette publique.</p>";
    return;
  }

  adminBannerList.innerHTML = publicBanners
    .map(
      (banner) => `
        <article class="admin-banner-item" data-banner-id="${banner.id}">
          <input class="admin-banner-title" type="text" value="${escapeHtml(banner.title)}" />
          <input class="admin-banner-color" type="color" value="${escapeHtml(banner.color || "#ffc857")}" />
          <label>
            <input class="admin-banner-active" type="checkbox" ${banner.is_active ? "checked" : ""} />
            Visible
          </label>
          <div class="admin-banner-actions">
            <button class="admin-small-action save-banner" type="button">✅ Sauvegarder</button>
            <button class="admin-small-action delete-banner" type="button">❌ Supprimer</button>
          </div>
        </article>
      `
    )
    .join("");

  adminBannerList.querySelectorAll(".save-banner").forEach((button) => {
    button.addEventListener("click", () => savePublicBanner(button.closest(".admin-banner-item")));
  });
  adminBannerList.querySelectorAll(".delete-banner").forEach((button) => {
    button.addEventListener("click", () => deletePublicBanner(button.closest(".admin-banner-item")));
  });
}

function applySectionVisibility() {
  document.querySelectorAll("[data-section-key]").forEach((element) => {
    const section = siteSections.find((item) => item.section_key === element.dataset.sectionKey);
    const isVisible = !section || section.is_visible;
    element.classList.toggle("section-hidden", !isVisible && !isAdminActive());
    element.classList.toggle("section-admin-hidden", !isVisible && isAdminActive());
  });
}

function renderCustomSections() {
  if (!customSections) {
    return;
  }

  const visibleSections = siteSections.filter((section) => section.is_custom && (section.is_visible || isAdminActive()));

  customSections.innerHTML = visibleSections
    .map(
      (section) => `
        <section class="section custom-section ${section.is_visible ? "" : "section-admin-hidden"}" data-section-key="${escapeHtml(section.section_key)}">
          <div class="section-heading">
            <p class="eyebrow">${section.is_visible ? "Section" : "Section cachee"}</p>
            <h2>${escapeHtml(section.title || section.label)}</h2>
            <p>${escapeHtml(section.body || "")}</p>
          </div>
        </section>
      `
    )
    .join("");
}

function renderAdminSections() {
  if (!adminSectionList || !hasPermission("manage_sections")) {
    return;
  }

  if (siteSections.length === 0) {
    adminSectionList.innerHTML = "<p>Aucune section chargee.</p>";
    return;
  }

  const isOwner = getAdminContext().role === "owner";
  adminSectionList.innerHTML = siteSections
    .map(
      (section) => `
        <article class="admin-section-item" data-section-key="${escapeHtml(section.section_key)}">
          <div>
            <strong>${escapeHtml(section.label)}</strong>
            <span>${section.is_custom ? "Custom" : "Section native"} - ${section.is_visible ? "visible" : "cachee"}</span>
          </div>
          <div class="admin-section-actions">
            <button class="admin-small-action toggle-section" type="button">
              ${section.is_visible ? "🙈 Cacher" : "✅ Afficher"}
            </button>
            ${
              section.is_custom
                ? '<button class="admin-small-action edit-section" type="button">✏️ Modifier</button>'
                : ""
            }
            ${
              section.is_custom && isOwner
                ? '<button class="admin-small-action delete-section" type="button">❌ Supprimer</button>'
                : ""
            }
          </div>
        </article>
      `
    )
    .join("");

  adminSectionList.querySelectorAll(".toggle-section").forEach((button) => {
    button.addEventListener("click", () => toggleSiteSection(button.closest(".admin-section-item")));
  });
  adminSectionList.querySelectorAll(".edit-section").forEach((button) => {
    button.addEventListener("click", () => editCustomSiteSection(button.closest(".admin-section-item")));
  });
  adminSectionList.querySelectorAll(".delete-section").forEach((button) => {
    button.addEventListener("click", () => deleteCustomSiteSection(button.closest(".admin-section-item")));
  });
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
  const canMoveMembers = canManageMembers || hasPermission("move_members");
  const canManageRosters = hasPermission("manage_rosters");

  sortedRosters.forEach((roster) => {
    const column = document.createElement("article");
    column.className = "roster-column reveal is-visible";
    column.dataset.rosterId = roster.id;

    column.addEventListener("dragover", (event) => {
      if (!isAdminActive() || !canMoveMembers || draggedMemberId === null) {
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

      if (!isAdminActive() || !canMoveMembers || draggedMemberId === null) {
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
  const canMoveMembers = canManageMembers || hasPermission("move_members");
  const card = document.createElement("article");
  card.className = "member-card";
  card.classList.toggle("has-member-link", Boolean(member.profile_url));
  card.draggable = isAdminActive() && canMoveMembers;
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
      ${member.profile_url ? "<span>Lien</span>" : ""}
    </div>
  `;

  card.addEventListener("dragstart", (event) => {
    if (!isAdminActive() || !canMoveMembers) {
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

  card.addEventListener("click", (event) => {
    if (isAdminActive() || !member.profile_url || event.target.closest("button")) {
      return;
    }

    const safeUrl = normalizeMemberUrl(member.profile_url);

    if (safeUrl) {
      window.open(safeUrl, "_blank", "noopener,noreferrer");
    }
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
  memberForm.elements["member-link"].value = member ? member.profile_url || "" : "";
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
    p_profile_url: member.profile_url || "",
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

  if (!adminContext || !supabaseClient || !(hasPermission("manage_members") || hasPermission("move_members"))) {
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
      <button class="admin-summary-button" type="button" data-open-panel-section="members">
        ${members.length} membre${members.length > 1 ? "s" : ""}
      </button>
    `;

    adminPanelSummary.querySelector("[data-open-panel-section='members']")?.addEventListener("click", () => {
      openPanelMembersSection();
    });
  }

  if (adminLogList) {
    adminLogList.innerHTML = hasPermission("view_history")
      ? "<p>Chargement de l'historique...</p>"
      : "<p>Tu n'as pas la permission de voir l'historique.</p>";
  }

  if (adminPermissionsSection) {
    adminPermissionsSection.hidden = !(hasPermission("manage_permissions") || hasPermission("manage_roster_managers"));
  }

  const roleSelect = adminCreateForm?.querySelector('[name="admin-role"]');
  if (roleSelect) {
    roleSelect.value = hasPermission("manage_admins") ? roleSelect.value : "manager_roster";
    roleSelect.disabled = !hasPermission("manage_admins");
  }

  if (adminAnnouncementsSection) {
    adminAnnouncementsSection.hidden = !hasPermission("manage_announcements");
  }

  if (adminBackupsSection) {
    adminBackupsSection.hidden = !hasPermission("manage_backups");
  }

  if (adminSectionsSection) {
    adminSectionsSection.hidden = !hasPermission("manage_sections");
  }

  if (adminMembersSection) {
    adminMembersSection.hidden = true;
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
      p_range: adminLogFilter?.value || "all",
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

  if (hasPermission("manage_announcements")) {
    renderAdminBanners();
  }

  if (hasPermission("manage_backups")) {
    await loadContentBackups();
  }

  if (hasPermission("manage_sections")) {
    renderAdminSections();
  }

  renderPanelMemberTools();
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
      const detailText = formatLogDetails(log);
      const restoreButton =
        hasPermission("manage_backups") && log.action === "edit_content" && log.details?.before !== null
          ? `<button class="admin-small-action restore-text-version" type="button" data-log-id="${log.id}">↩️ Restaurer</button>`
          : "";
      return `
        <article class="admin-log-item">
          <span class="admin-log-icon">${escapeHtml(getActionIcon(log.action))}</span>
          <strong>${escapeHtml(log.admin_name)}</strong>
          <span>${escapeHtml(formatAdminAction(log.action))} - ${escapeHtml(getLogTargetText(log))}</span>
          <time datetime="${escapeHtml(log.created_at)}">${escapeHtml(date.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "medium" }))}</time>
          <button class="admin-log-details-button" type="button">🔎 Details</button>
          <div class="admin-log-details">${escapeHtml(detailText)}${restoreButton}</div>
        </article>
      `;
    })
    .join("");

  adminLogList.querySelectorAll(".admin-log-details-button").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".admin-log-item")?.classList.toggle("is-open");
    });
  });

  adminLogList.querySelectorAll(".restore-text-version").forEach((button) => {
    button.addEventListener("click", () => restoreTextVersion(Number(button.dataset.logId)));
  });
}

function renderAdminPermissions(admins) {
  if (!adminPermissionsList) {
    return;
  }

  adminPermissionsList.innerHTML = admins
    .map((admin) => {
      const isOwner = admin.role === "owner";
      const fullPermissionEdit = hasPermission("manage_permissions");
      const permissionInputs = Object.entries(PERMISSION_LABELS)
        .map(([key, label]) => {
          const checked = admin.role === "owner" || admin.permissions?.[key] === true ? "checked" : "";
          const disabled = isOwner || !fullPermissionEdit ? "disabled" : "";
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
          ${
            isOwner
              ? ""
              : `<select class="admin-role-select" ${fullPermissionEdit ? "" : "disabled"}>
                  <option value="admin" ${admin.role === "admin" ? "selected" : ""}>Admin</option>
                  <option value="manager_roster" ${admin.role === "manager_roster" ? "selected" : ""}>Manager roster</option>
                </select>`
          }
          <div class="admin-permission-grid">${permissionInputs}</div>
          ${
            isOwner
              ? ""
              : `<div class="admin-permission-actions">
                  <button class="button compact save-admin-permissions" type="button">✅ Sauvegarder</button>
                  <button class="admin-small-action reset-admin-code" type="button">🔑 Changer code</button>
                  <button class="admin-small-action force-admin-logout" type="button">🚪 Forcer deco</button>
                  <button class="admin-small-action delete-admin-user" type="button">❌ Supprimer</button>
                </div>`
          }
        </article>
      `;
    })
    .join("");

  adminPermissionsList.querySelectorAll(".save-admin-permissions").forEach((button) => {
    button.addEventListener("click", () => saveAdminPermissions(button.closest(".admin-permission-card")));
  });
  adminPermissionsList.querySelectorAll(".reset-admin-code").forEach((button) => {
    button.addEventListener("click", () => resetAdminCode(button.closest(".admin-permission-card")));
  });
  adminPermissionsList.querySelectorAll(".force-admin-logout").forEach((button) => {
    button.addEventListener("click", () => forceAdminLogout(button.closest(".admin-permission-card")));
  });
  adminPermissionsList.querySelectorAll(".delete-admin-user").forEach((button) => {
    button.addEventListener("click", () => deleteAdminUser(button.closest(".admin-permission-card")));
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
    p_role: card.querySelector(".admin-role-select")?.value || null,
  });

  if (error) {
    console.error("Sauvegarde permissions impossible.", error);
    setSaveStatus("Erreur permissions", "error");
    return;
  }

  setSaveStatus("Permissions sauvegardees", "saved");
  await loadAdminPanelData();
}

async function createSiteSectionFromPanel(event) {
  event.preventDefault();

  const formData = new FormData(adminSectionForm);
  const label = String(formData.get("section-label") || "").trim();
  const title = String(formData.get("section-title") || "").trim();
  const body = String(formData.get("section-body") || "").trim();

  if (!label || !title) {
    setSaveStatus("Nom et titre requis", "error");
    return;
  }

  const context = getAdminContext();
  const { error } = await supabaseClient.rpc("create_custom_site_section", {
    p_admin_name: context.name,
    p_admin_code: context.code,
    p_label: label,
    p_title: title,
    p_body: body,
  });

  if (error) {
    console.error("Creation section impossible.", error);
    setSaveStatus("Erreur section", "error");
    return;
  }

  adminSectionForm.reset();
  setSaveStatus("Section creee", "saved");
  await loadSiteSections();
  await loadAdminPanelData();
}

async function toggleSiteSection(card) {
  const section = siteSections.find((item) => item.section_key === card?.dataset.sectionKey);

  if (!section) {
    return;
  }

  const context = getAdminContext();
  const { error } = await supabaseClient.rpc("upsert_site_section_visibility", {
    p_admin_name: context.name,
    p_admin_code: context.code,
    p_section_key: section.section_key,
    p_is_visible: !section.is_visible,
  });

  if (error) {
    console.error("Visibilite section impossible.", error);
    setSaveStatus("Erreur visibilite", "error");
    return;
  }

  setSaveStatus(section.is_visible ? "Section cachee" : "Section affichee", "saved");
  await loadSiteSections();
  await loadAdminPanelData();
}

async function editCustomSiteSection(card) {
  const section = siteSections.find((item) => item.section_key === card?.dataset.sectionKey);

  if (!section || !section.is_custom) {
    return;
  }

  const label = window.prompt("Nom interne", section.label) || section.label;
  const title = window.prompt("Titre affiche", section.title) || section.title;
  const body = window.prompt("Texte de la section", section.body) || section.body;
  const context = getAdminContext();

  const { error } = await supabaseClient.rpc("update_custom_site_section", {
    p_admin_name: context.name,
    p_admin_code: context.code,
    p_section_key: section.section_key,
    p_label: label.trim(),
    p_title: title.trim(),
    p_body: body.trim(),
  });

  if (error) {
    console.error("Modification section impossible.", error);
    setSaveStatus("Erreur section", "error");
    return;
  }

  setSaveStatus("Section modifiee", "saved");
  await loadSiteSections();
  await loadAdminPanelData();
}

async function deleteCustomSiteSection(card) {
  const section = siteSections.find((item) => item.section_key === card?.dataset.sectionKey);

  if (!section || !section.is_custom || !window.confirm(`Supprimer la section ${section.label} ?`)) {
    return;
  }

  const context = getAdminContext();
  const { error } = await supabaseClient.rpc("delete_custom_site_section", {
    p_owner_name: context.name,
    p_owner_code: context.code,
    p_section_key: section.section_key,
  });

  if (error) {
    console.error("Suppression section impossible.", error);
    setSaveStatus("Suppression refusee", "error");
    return;
  }

  setSaveStatus("Section supprimee", "saved");
  await loadSiteSections();
  await loadAdminPanelData();
}

function openPanelMembersSection() {
  if (!adminMembersSection) {
    return;
  }

  adminMembersSection.hidden = false;
  renderPanelMemberTools();
  adminMembersSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderPanelMemberTools() {
  if (!adminMembersSection || !hasPermission("manage_members")) {
    if (adminMembersSection) {
      adminMembersSection.hidden = true;
    }
    return;
  }

  renderPanelRosterSelects();
  renderPanelMemberList();
}

function renderPanelRosterSelects() {
  const options = rosters
    .sort(sortByOrderThenName)
    .map((roster) => `<option value="${roster.id}">${escapeHtml(roster.name)}</option>`)
    .join("");

  document.querySelectorAll(".panel-member-roster-select").forEach((select) => {
    const currentValue = select.value;
    select.innerHTML = options;
    select.value = currentValue;
  });

  const createSelect = adminMemberCreateForm?.querySelector('[name="panel-member-roster"]');
  if (createSelect) {
    const currentValue = createSelect.value;
    createSelect.innerHTML = options;
    createSelect.value = currentValue || rosters[0]?.id || "";
  }
}

function renderPanelMemberList() {
  if (!adminMemberList) {
    return;
  }

  if (members.length === 0) {
    adminMemberList.innerHTML = "<p>Aucun membre pour le moment.</p>";
    return;
  }

  const rosterOptions = rosters
    .sort(sortByOrderThenName)
    .map((roster) => `<option value="${roster.id}">${escapeHtml(roster.name)}</option>`)
    .join("");

  adminMemberList.innerHTML = [...members]
    .sort(sortByOrderThenName)
    .map(
      (member) => `
        <article class="admin-member-row" data-member-id="${member.id}">
          <input class="panel-member-name" type="text" value="${escapeHtml(member.name)}" />
          <input class="panel-member-role" type="text" value="${escapeHtml(member.role || "")}" />
          <input class="panel-member-level" type="text" value="${escapeHtml(member.level || "")}" />
          <input class="panel-member-link" type="url" value="${escapeHtml(member.profile_url || "")}" placeholder="https://..." />
          <select class="panel-member-roster-select">${rosterOptions}</select>
          <div class="admin-member-actions">
            <button class="admin-small-action save-panel-member" type="button">✅ Sauver</button>
            <button class="admin-small-action delete-panel-member" type="button">❌ Supprimer</button>
          </div>
        </article>
      `
    )
    .join("");

  adminMemberList.querySelectorAll(".admin-member-row").forEach((row) => {
    const member = members.find((item) => item.id === Number(row.dataset.memberId));
    const select = row.querySelector(".panel-member-roster-select");

    if (member && select) {
      select.value = member.roster_id;
    }
  });

  adminMemberList.querySelectorAll(".save-panel-member").forEach((button) => {
    button.addEventListener("click", () => saveMemberFromPanel(button.closest(".admin-member-row")));
  });
  adminMemberList.querySelectorAll(".delete-panel-member").forEach((button) => {
    button.addEventListener("click", () => deleteMemberFromPanel(button.closest(".admin-member-row")));
  });
}

async function createMemberFromPanel(event) {
  event.preventDefault();

  const formData = new FormData(adminMemberCreateForm);
  const rosterId = Number(formData.get("panel-member-roster"));
  const rosterMembers = members.filter((member) => member.roster_id === rosterId);
  const name = String(formData.get("panel-member-name") || "").trim();

  if (!name || !rosterId) {
    setSaveStatus("Pseudo et roster requis", "error");
    return;
  }

  await saveMember({
    id: null,
    roster_id: rosterId,
    name,
    role: String(formData.get("panel-member-role") || "").trim(),
    level: String(formData.get("panel-member-level") || "").trim(),
    profile_url: normalizeMemberUrl(formData.get("panel-member-link") || ""),
    sort_order: rosterMembers.length,
  });

  adminMemberCreateForm.reset();
  await loadRosterData();
  renderPanelMemberTools();
}

async function saveMemberFromPanel(row) {
  if (!row) {
    return;
  }

  const memberId = Number(row.dataset.memberId);
  const rosterId = Number(row.querySelector(".panel-member-roster-select")?.value);

  await saveMember({
    id: memberId,
    roster_id: rosterId,
    name: row.querySelector(".panel-member-name")?.value.trim() || "",
    role: row.querySelector(".panel-member-role")?.value.trim() || "",
    level: row.querySelector(".panel-member-level")?.value.trim() || "",
    profile_url: normalizeMemberUrl(row.querySelector(".panel-member-link")?.value || ""),
    sort_order: getMemberSortOrder(memberId),
  });

  await loadRosterData();
  renderPanelMemberTools();
}

async function deleteMemberFromPanel(row) {
  if (!row) {
    return;
  }

  await deleteMember(Number(row.dataset.memberId));
  await loadRosterData();
  renderPanelMemberTools();
}

async function createAdminFromPanel(event) {
  event.preventDefault();

  const formData = new FormData(adminCreateForm);
  const name = String(formData.get("admin-name") || "").trim();
  const code = String(formData.get("admin-code") || "").trim();
  const requestedRole = String(formData.get("admin-role") || "admin");
  const role = hasPermission("manage_admins") ? requestedRole : "manager_roster";

  if (!name || !code) {
    setSaveStatus("Nom et code requis", "error");
    return;
  }

  const context = getAdminContext();
  const permissions = role === "manager_roster"
    ? { move_members: true }
    : {
        edit_content: true,
        manage_rosters: true,
        manage_members: true,
        view_history: false,
        manage_permissions: false,
        clear_history: false,
      };

  const { error } = await supabaseClient.rpc("create_site_admin_user", {
    p_owner_name: context.name,
    p_owner_code: context.code,
    p_new_name: name,
    p_new_code: code,
    p_role: role,
    p_permissions: permissions,
  });

  if (error) {
    console.error("Creation admin impossible.", error);
    setSaveStatus("Erreur creation admin", "error");
    return;
  }

  adminCreateForm.reset();
  setSaveStatus("Admin ajoute", "saved");
  await loadAdminPanelData();
}

async function resetAdminCode(card) {
  const newCode = window.prompt(`Nouveau code pour ${card?.dataset.adminName || "admin"} ?`);

  if (!card || !newCode) {
    return;
  }

  const context = getAdminContext();
  const { error } = await supabaseClient.rpc("reset_site_admin_code", {
    p_owner_name: context.name,
    p_owner_code: context.code,
    p_target_admin_name: card.dataset.adminName,
    p_new_code: newCode.trim(),
  });

  if (error) {
    console.error("Reset code impossible.", error);
    setSaveStatus("Erreur code admin", "error");
    return;
  }

  setSaveStatus("Code admin change", "saved");
  await loadAdminPanelData();
}

async function forceAdminLogout(card) {
  if (!card || !window.confirm(`Forcer la deconnexion de ${card.dataset.adminName} ?`)) {
    return;
  }

  const context = getAdminContext();
  const { error } = await supabaseClient.rpc("force_site_admin_logout", {
    p_owner_name: context.name,
    p_owner_code: context.code,
    p_target_admin_name: card.dataset.adminName,
  });

  if (error) {
    console.error("Deconnexion forcee impossible.", error);
    setSaveStatus("Erreur deconnexion", "error");
    return;
  }

  setSaveStatus("Deconnexion forcee", "saved");
  await loadAdminPanelData();
}

async function deleteAdminUser(card) {
  if (!card || !window.confirm(`Supprimer ${card.dataset.adminName} des admins ?`)) {
    return;
  }

  const context = getAdminContext();
  const { error } = await supabaseClient.rpc("delete_site_admin_user", {
    p_owner_name: context.name,
    p_owner_code: context.code,
    p_target_admin_name: card.dataset.adminName,
  });

  if (error) {
    console.error("Suppression admin impossible.", error);
    setSaveStatus("Erreur suppression admin", "error");
    return;
  }

  setSaveStatus("Admin supprime", "saved");
  await loadAdminPanelData();
}

async function createPublicBannerFromPanel(event) {
  event.preventDefault();

  const formData = new FormData(adminBannerForm);
  const title = String(formData.get("banner-title") || "").trim();
  const color = String(formData.get("banner-color") || "#ffc857").trim();

  if (!title) {
    setSaveStatus("Titre requis", "error");
    return;
  }

  const context = getAdminContext();
  const { error } = await supabaseClient.rpc("create_public_banner", {
    p_admin_name: context.name,
    p_admin_code: context.code,
    p_title: title,
    p_color: color,
  });

  if (error) {
    console.error("Bandelette impossible.", error);
    setSaveStatus("Erreur bandelette", "error");
    return;
  }

  adminBannerForm.reset();
  setSaveStatus("Bandelette publiee", "saved");
  await loadPublicBanners();
  await loadAdminPanelData();
}

async function savePublicBanner(card) {
  if (!card) {
    return;
  }

  const context = getAdminContext();
  const { error } = await supabaseClient.rpc("update_public_banner", {
    p_admin_name: context.name,
    p_admin_code: context.code,
    p_id: Number(card.dataset.bannerId),
    p_title: card.querySelector(".admin-banner-title")?.value.trim() || "",
    p_color: card.querySelector(".admin-banner-color")?.value || "#ffc857",
    p_is_active: card.querySelector(".admin-banner-active")?.checked === true,
  });

  if (error) {
    console.error("Sauvegarde bandelette impossible.", error);
    setSaveStatus("Erreur bandelette", "error");
    return;
  }

  setSaveStatus("Bandelette sauvegardee", "saved");
  await loadPublicBanners();
  await loadAdminPanelData();
}

async function deletePublicBanner(card) {
  if (!card || !window.confirm("Supprimer cette bandelette ?")) {
    return;
  }

  const context = getAdminContext();
  const { error } = await supabaseClient.rpc("delete_public_banner", {
    p_admin_name: context.name,
    p_admin_code: context.code,
    p_id: Number(card.dataset.bannerId),
  });

  if (error) {
    console.error("Suppression bandelette impossible.", error);
    setSaveStatus("Erreur suppression", "error");
    return;
  }

  setSaveStatus("Bandelette supprimee", "saved");
  await loadPublicBanners();
  await loadAdminPanelData();
}

async function createContentBackup() {
  const label = window.prompt("Nom du backup ?", `Backup ${new Date().toLocaleString("fr-FR")}`);

  if (!label) {
    return;
  }

  const context = getAdminContext();
  const { error } = await supabaseClient.rpc("create_site_content_backup", {
    p_admin_name: context.name,
    p_admin_code: context.code,
    p_label: label.trim(),
  });

  if (error) {
    console.error("Backup impossible.", error);
    setSaveStatus("Erreur backup", "error");
    return;
  }

  setSaveStatus("Backup cree", "saved");
  await loadContentBackups();
  await loadAdminPanelData();
}

async function loadContentBackups() {
  const context = getAdminContext();
  const { data, error } = await supabaseClient.rpc("get_site_content_backups", {
    p_admin_name: context.name,
    p_admin_code: context.code,
  });

  if (error) {
    console.error("Backups impossibles.", error);
    if (adminBackupList) {
      adminBackupList.innerHTML = "<p>Impossible de charger les backups.</p>";
    }
    return;
  }

  if (!adminBackupList) {
    return;
  }

  adminBackupList.innerHTML = (data || []).length
    ? data
        .map(
          (backup) => `
            <article class="admin-backup-item">
              <strong>${escapeHtml(backup.label)}</strong>
              <p>${escapeHtml(backup.created_by)} - ${escapeHtml(new Date(backup.created_at).toLocaleString("fr-FR"))}</p>
              <button class="admin-small-action restore-backup" type="button" data-backup-id="${backup.id}">↩️ Restaurer</button>
            </article>
          `
        )
        .join("")
    : "<p>Aucun backup.</p>";

  adminBackupList.querySelectorAll(".restore-backup").forEach((button) => {
    button.addEventListener("click", () => restoreContentBackup(Number(button.dataset.backupId)));
  });
}

async function restoreContentBackup(backupId) {
  if (!window.confirm("Restaurer ce backup de textes ?")) {
    return;
  }

  const context = getAdminContext();
  const { error } = await supabaseClient.rpc("restore_site_content_backup", {
    p_admin_name: context.name,
    p_admin_code: context.code,
    p_backup_id: backupId,
  });

  if (error) {
    console.error("Restauration backup impossible.", error);
    setSaveStatus("Erreur restauration", "error");
    return;
  }

  setSaveStatus("Backup restaure", "saved");
  await loadSupabaseContent();
  await loadAdminPanelData();
}

async function restoreTextVersion(logId) {
  if (!window.confirm("Restaurer cette ancienne version du texte ?")) {
    return;
  }

  const context = getAdminContext();
  const { error } = await supabaseClient.rpc("restore_site_content_from_log", {
    p_admin_name: context.name,
    p_admin_code: context.code,
    p_log_id: logId,
  });

  if (error) {
    console.error("Restauration texte impossible.", error);
    setSaveStatus("Erreur restauration", "error");
    return;
  }

  setSaveStatus("Version restauree", "saved");
  await loadSupabaseContent();
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
    edit_content: "✏️ Texte modifie",
    create_roster: "➕ Roster cree",
    edit_roster: "📋 Roster modifie",
    delete_roster: "❌ Roster supprime",
    create_member: "✅ Membre ajoute",
    edit_member: "👤 Membre modifie",
    delete_member: "❌ Membre supprime",
    move_member: "➡️ Membre deplace",
    update_permissions: "🔐 Permissions modifiees",
    clear_history: "🧹 Historique vide",
    create_admin: "🛡️ Admin ajoute",
    delete_admin: "❌ Admin supprime",
    reset_admin_code: "🔑 Code admin change",
    force_logout: "🚪 Deconnexion forcee",
    create_announcement: "📣 Annonce interne",
    create_public_banner: "📣 Bandelette creee",
    update_public_banner: "📣 Bandelette modifiee",
    delete_public_banner: "❌ Bandelette supprimee",
    create_backup: "💾 Backup cree",
    restore_backup: "↩️ Backup restaure",
    restore_text_version: "↩️ Ancienne version restauree",
    hide_section: "🙈 Section cachee",
    show_section: "✅ Section affichee",
    create_section: "🧩 Section creee",
    edit_section: "✏️ Section modifiee",
    delete_section: "❌ Section supprimee",
  };

  return labels[action] || action;
}

function getActionIcon(action) {
  if (action.includes("delete")) return "❌";
  if (action.includes("create")) return "✅";
  if (action.includes("move")) return "➡️";
  if (action.includes("permission") || action.includes("admin") || action.includes("logout")) return "🔐";
  if (action.includes("backup") || action.includes("restore")) return "↩️";
  if (action.includes("announcement")) return "📣";
  if (action.includes("section")) return "🧩";
  if (action.includes("content") || action.includes("text")) return "✏️";
  return "•";
}

function getLogTargetText(log) {
  if (log.action === "move_member" && log.details?.sentence) {
    return log.details.sentence;
  }

  return log.target || "-";
}

function formatLogDetails(log) {
  if (log.action === "edit_content") {
    return `Avant: ${log.details?.before || ""}\nApres: ${log.details?.after || ""}`;
  }

  if (log.action === "move_member" && log.details?.sentence) {
    return log.details.sentence;
  }

  return JSON.stringify(log.details || {}, null, 2);
}

function normalizeMemberUrl(url) {
  const value = String(url || "").trim();

  if (!value) {
    return "";
  }

  try {
    const parsedUrl = new URL(value);
    return ["http:", "https:"].includes(parsedUrl.protocol) ? parsedUrl.href : "";
  } catch {
    return "";
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
