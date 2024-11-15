/**
 * Adds an ability for highlight rows by clicking.
 */
function init_highlights() {
  var assignees = document.querySelectorAll(".assignees > tbody > tr");
  var epics = document.querySelectorAll(".epics > tbody > tr");
  var stories = document.querySelectorAll(".stories > tbody > tr");

  function deselect(doc, className) {
    doc.querySelectorAll(`tr.${className}`).forEach((el) => {
      el.classList.remove(className);
    })
  }

  for (var i in assignees) {
    var assignee = assignees[i];

    if (
        assignee !== undefined
        && assignee.attributes !== undefined
        && assignee.attributes['data-assignee-id'] !== undefined
    ) {
      var assigneeId = assignee.attributes['data-assignee-id'];

      var listenerSelector = (
        `table.assignees [${assigneeId.name}="${assigneeId.value}"]`
      );

      document.querySelector(listenerSelector).onclick = function () {
        var attr = this.attributes['data-assignee-id'];
        var selector = (
          `table.component [${attr.name}="${attr.value}"]`
        );

        deselect(document, "highlighted-epic");
        deselect(document, "highlighted-story");

        this.classList.toggle("highlighted");

        document.querySelectorAll(selector).forEach((el) => {
          el.classList.toggle("highlighted");
        })
      }
    }
  }

  for (var i in epics) {
    var epic = epics[i];

    if (
        epic !== undefined
        && epic.attributes !== undefined
        && epic.attributes['data-epic-id'] !== undefined
    ) {
      var epicId = epic.attributes['data-epic-id'];

      var listenerSelector = (
        `table.epics [${epicId.name}="${epicId.value}"]`
      );

      document.querySelector(listenerSelector).onclick = function () {
        var attr = this.attributes['data-epic-id'];
        var selector = (
          `table.component [data-parent-id="${attr.value}"]`
        );

        deselect(document, "highlighted");
        deselect(document, "highlighted-story");

        this.classList.toggle("highlighted-epic");

        document.querySelectorAll(selector).forEach((el) => {
          el.classList.toggle("highlighted-epic");
        })
      }
    }
  }

  for (var i in stories) {
    var story = stories[i];

    if (
        story !== undefined
        && story.attributes !== undefined
        && story.attributes['data-story-id'] !== undefined
    ) {
      var storyId = story.attributes['data-story-id'];

      var listenerSelector = (
        `table.stories [${storyId.name}="${storyId.value}"]`
      );

      document.querySelector(listenerSelector).onclick = function () {
        var attr = this.attributes['data-story-id'];
        var selector = (
          `table.component [data-parent-id="${attr.value}"]`
        );

        deselect(document, "highlighted");
        deselect(document, "highlighted-epic");

        this.classList.toggle("highlighted-story");

        document.querySelectorAll(selector).forEach((el) => {
          el.classList.toggle("highlighted-story");
        })
      }
    }
  }
}

/**
 * Saves settings into local storage.
 */
function saveSettings(tableName, settingsJson) {
  localStorage.setItem(tableName, JSON.stringify(settingsJson));
}

/**
 * Returns settings json if exists else returns an empty object.
 */
function getSettings(tableName) {
  const data = localStorage.getItem(tableName);

  if (!data) {
    return JSON.constructor();
  }

  return JSON.parse(data);
}

/**
 * Adds an ability to control visibility of component issue rows
 * by clicking on version columns.
 */
function init_version_columns() {
  var versions = document.querySelectorAll(".issues th.version");
  var settings = getSettings("components");
  const collapsedClassName = "collapsed";

  for (var i in versions) {
    var version = versions[i];

    if (
        version !== undefined
        && version.attributes !== undefined
        && version.attributes['data-version-id'] !== undefined
    ) {
      var versionId = version.attributes['data-version-id'];
      var componentId = version.attributes['data-component-id'];

      var listenerSelector = (
        `table.component [${versionId.name}="${versionId.value}"]`
        +`[${componentId.name}="${componentId.value}"] > span.collapse`
      );

      document.querySelector(listenerSelector).onclick = function () {
        var versionAttr = this.parentNode.attributes['data-version-id'];
        var componentAttr = this.parentNode.attributes['data-component-id'];

        var selector = (
          `table.component [data-version-ids="${versionAttr.value}"]`
          +`[data-component-id="${componentAttr.value}"]`
        );

        this.classList.toggle("up");
        this.parentNode.classList.toggle(collapsedClassName);

        var isVersionCollapsed = this.parentNode.classList.contains(
          collapsedClassName
        )

        if (!settings[componentAttr.value]) {
          settings[componentAttr.value] = JSON.constructor();
        }

        settings[componentAttr.value][versionAttr.value] = isVersionCollapsed;
        saveSettings("components", settings)

        document.querySelectorAll(selector).forEach((el) => {
          el.classList.toggle(collapsedClassName);
        })
      }
    }
  }
}

/**
 * Adds an ability to control visibility of component issue rows
 * by clicking on version columns.
 */
function init_sprint_columns() {
  var sprints = document.querySelectorAll(".issues th.sprint");
  var settings = getSettings("components");
  const collapsedClassName = "collapsed";

  for (var i in sprints) {
    var sprint = sprints[i];

    if (
        sprint !== undefined
        && sprint.attributes !== undefined
        && sprint.attributes['data-sprint-id'] !== undefined
    ) {
      var sprintId = sprint.attributes['data-sprint-id'];
      var componentId = sprint.attributes['data-component-id'];

      var listenerSelector = (
        `table.component [${sprintId.name}="${sprintId.value}"]`
        +`[${componentId.name}="${componentId.value}"] > span.collapse`
      );

      document.querySelector(listenerSelector).onclick = function () {
        var sprintAttr = this.parentNode.attributes['data-sprint-id'];
        var componentAttr = this.parentNode.attributes['data-component-id'];

        var selector = (
          `table.component [data-sprint-ids="${sprintAttr.value}"]`
          +`[data-component-id="${componentAttr.value}"]`
        );

        this.classList.toggle("up");
        this.parentNode.classList.toggle(collapsedClassName);

        var isSprintCollapsed = this.parentNode.classList.contains(
          collapsedClassName
        )

        if (!settings[componentAttr.value]) {
          settings[componentAttr.value] = JSON.constructor();
        }

        settings[componentAttr.value][sprintAttr.value] = isSprintCollapsed;
        saveSettings("components", settings)

        document.querySelectorAll(selector).forEach((el) => {
          el.classList.toggle(collapsedClassName);
        })
      }
    }
  }
}

/**
 * Collapses version column and hides related rows.
 */
function setVersionCollapsed(componentId, versionId, collapsed = true) {
  var versionColumnsSelector = (
    `.issues th.version[data-component-id="${componentId}"]`
    + `[data-version-id="${versionId}"]`
  )
  var versionRowsSelector = (
    `table.component [data-component-id="${componentId}"]`
    + `[data-version-ids="${versionId}"]`
  );

  document.querySelectorAll(versionColumnsSelector).forEach((column) => {
    if (collapsed) {
      column.classList.add("collapsed");
      column.querySelector("span.collapse").classList.add("up");
    } else {
      column.classList.remove("collapsed");
      column.querySelector("span.collapse").classList.remove("up");
    }
  });

  document.querySelectorAll(versionRowsSelector).forEach((row) => {
    if (collapsed) {
      row.classList.add("collapsed");
    } else {
      row.classList.remove("collapsed");
    }
  });
}

/**
 * Collapses sprint column and hides related rows.
 */
function setSprintCollapsed(componentId, sprintId, collapsed = true) {
  var sprintColumnsSelector = (
    `.issues th.sprint[data-component-id="${componentId}"]`
    + `[data-sprint-id="${sprintId}"]`
  )
  var sprintRowsSelector = (
    `table.component [data-component-id="${componentId}"]`
    + `[data-sprint-ids="${sprintId}"]`
  );

  document.querySelectorAll(sprintColumnsSelector).forEach((column) => {
    if (collapsed) {
      column.classList.add("collapsed");
      column.querySelector("span.collapse").classList.add("up");
    } else {
      column.classList.remove("collapsed");
      column.querySelector("span.collapse").classList.remove("up");
    }
  });

  document.querySelectorAll(sprintRowsSelector).forEach((row) => {
    if (collapsed) {
      row.classList.add("collapsed");
    } else {
      row.classList.remove("collapsed");
    }
  });
}

/**
 * Hides version column and hides related rows.
 */
function setVersionHidden(versionId, hidden = true) {
  var versionColumnsSelector = (
    `.issues [data-version-id="${versionId}"]`
  )
  var versionRowsSelector = (
    `table.component [data-version-ids*="${versionId}"]`
  );

  document.querySelectorAll(versionColumnsSelector).forEach((column) => {
    if (hidden) {
      column.classList.add("hidden");
    } else {
      column.classList.remove("hidden");
    }
  });

  document.querySelectorAll(versionRowsSelector).forEach((row) => {
    if (hidden) {
      row.classList.add("hidden");
    } else {
      row.classList.remove("hidden");
    }
  });
}

/**
 * Hides sprint column and hides related rows.
 */
function setSprintHidden(sprintId, hidden = true) {
  var sprintColumnsSelector = (
    `.issues [data-sprint-id="${sprintId}"]`
  )
  var sprintRowsSelector = (
    `table.component [data-sprint-ids="${sprintId}"]`
  );

  document.querySelectorAll(sprintColumnsSelector).forEach((column) => {
    if (hidden) {
      column.classList.add("hidden");
    } else {
      column.classList.remove("hidden");
    }
  });

  document.querySelectorAll(sprintRowsSelector).forEach((row) => {
    if (hidden) {
      row.classList.add("hidden");
    } else {
      row.classList.remove("hidden");
    }
  });
}

/**
 * Applies stored settings for "components" table.
 */
function applyVersionComponentTableSettings() {
  const componentSettings = getSettings("components");
  const versionSettings = getSettings("versions");

  for (var componentId in componentSettings) {
    for (var versionId in componentSettings[componentId]) {
      setVersionCollapsed(
        componentId,
        versionId,
        componentSettings[componentId][versionId],
      );
    }
  }

  for (var versionId in versionSettings) {
    setVersionHidden(
      versionId,
      !versionSettings[versionId],
    );
  }
}

/**
 * Applies stored settings for version "components" table.
 */
function applySprintComponentTableSettings() {
  const componentSettings = getSettings("components");
  const sprintSettings = getSettings("sprints");

  for (var componentId in componentSettings) {
    for (var sprintId in componentSettings[componentId]) {
      setSprintCollapsed(
        componentId,
        sprintId,
        componentSettings[componentId][sprintId],
      );
    }
  }

  for (var sprintId in sprintSettings) {
    setSprintHidden(
      sprintId,
      !sprintSettings[sprintId],
    );
  }
}

/**
 * Calculate summary for selected versions
 */
function recalculateSelectedVersionSum(columnName) {
  var value = 0;
  let columnSelector = (
    `.version-row-selected [data-row-version-column-name="${columnName}"]`
  );
  let sumColumnSelector = (
    `table.versions [data-column-name="${columnName}"]`
  )
  let field = document.querySelector(sumColumnSelector)

  document.querySelectorAll(columnSelector).forEach((column) => {
    value += parseFloat(column.textContent) || 0;
  });

  value = Number(value.toFixed(2));

  if (field) {
    field.textContent = value;
  }
}

/**
 * Calculate summary for selected sprints
 */
function recalculateSelectedSprintsSum(columnName) {
  var value = 0;
  let columnSelector = (
    `.sprint-row-selected [data-row-sprint-column-name="${columnName}"]`
  );
  let sumColumnSelector = (
    `table.sprints [data-column-name="${columnName}"]`
  )
  let field = document.querySelector(sumColumnSelector)

  document.querySelectorAll(columnSelector).forEach((column) => {
    value += parseFloat(column.textContent) || 0;
  });

  value = Number(value.toFixed(2));
  
  if (field) {
    field.textContent = value;
  }
}

/**
 * Calculate avg for selected versions
 */
function recalculateSelectedVersionAvg(columnName) {
  var value = 0;
  var divider = 0; // need to count because empty row should be excluded
  let columnSelector = (
    `.version-row-selected [data-row-version-column-name="${columnName}"]`
  );
  let avgColumnSelector = (
    `table.versions [data-column-name="${columnName}"]`
  )
  let columns = document.querySelectorAll(columnSelector)
  let field = document.querySelector(avgColumnSelector)

  columns.forEach((column) => {
    let parsedValue = parseFloat(column.textContent)

    if (parsedValue && parsedValue > 0) {
      value += parsedValue;
      divider += 1;
    }
  });

  value = divider ? Number((value/divider).toFixed(2)) : null;

  if (field) {
    field.textContent = value || "";
  }
}

/**
 * Calculate avg for selected sprints
 */
function recalculateSelectedSprintsAvg(columnName) {
  var value = 0;
  var divider = 0; // need to count because empty row should be excluded
  let columnSelector = (
    `.sprint-row-selected [data-row-sprint-column-name="${columnName}"]`
  );
  let avgColumnSelector = (
    `table.sprints [data-column-name="${columnName}"]`
  )
  let columns = document.querySelectorAll(columnSelector)
  let field = document.querySelector(avgColumnSelector)

  columns.forEach((column) => {
    let parsedValue = parseFloat(column.textContent)

    if (parsedValue && parsedValue > 0) {
      value += parsedValue;
      divider += 1;
    }
  });

  value = divider ? Number((value/divider).toFixed(2)) : null;

  if (field) {
    field.textContent = value || "";
  }
}

/**
 * Toggle selected
 */
function toggleSelected(
    selector,
    isSelected,
    classname,
) {
  document.querySelectorAll(selector).forEach((elem) => {
    if (isSelected) {
      elem.classList.add(classname);
    } else {
      elem.classList.remove(classname);
    }
  });
}

/**
 * Initializes checkboxes in Versions table.
 */
function init_version_selector() {
  var checkboxes = document.querySelectorAll(
    "table.versions input[type=checkbox]"
  )
  let settings = getSettings("versions");

  checkboxes.forEach(function(checkbox) {
    var attr = checkbox.attributes["data-version-id"];
    var isChecked = true;

    // set initial state -- displayed
    if (settings[attr.value] != undefined) {
      isChecked = settings[attr.value];
    }

    checkbox.checked = isChecked;

    // mark related row selected
    let rowSelector = (`table.versions [data-row-version-id="${attr.value}"]`);
    toggleSelected(rowSelector, isChecked, "version-row-selected");

    checkbox.addEventListener("change", function() {
      settings[attr.value] = this.checked;
      saveSettings("versions", settings);
      setVersionHidden(attr.value, !this.checked);
      toggleSelected(rowSelector, this.checked, "version-row-selected");

      recalculateSelectedVersionSum("tasks");
      recalculateSelectedVersionSum("estimated");
      recalculateSelectedVersionSum("spent");
      recalculateSelectedVersionAvg("overtime");
    });
  });

  // recalculate summary for selected
  recalculateSelectedVersionSum("tasks");
  recalculateSelectedVersionSum("estimated");
  recalculateSelectedVersionSum("spent");
  recalculateSelectedVersionAvg("overtime");
}

/**
 * Initializes checkboxes in Sprint table.
 */
function init_sprint_selector() {
  var checkboxes = document.querySelectorAll(
    "table.sprints input[type=checkbox]"
  )
  let settings = getSettings("sprints");

  checkboxes.forEach(function(checkbox) {
    var attr = checkbox.attributes["data-sprint-id"];
    var isChecked = true;

    // set initial state -- displayed
    if (settings[attr.value] != undefined) {
      isChecked = settings[attr.value];
    }

    checkbox.checked = isChecked;

    // mark related row selected
    let rowSelector = (`table.sprints [data-row-sprint-id="${attr.value}"]`);
    toggleSelected(rowSelector, isChecked, "sprint-row-selected");

    checkbox.addEventListener("change", function() {
      settings[attr.value] = this.checked;
      saveSettings("sprints", settings);
      setSprintHidden(attr.value, !this.checked);
      toggleSelected(rowSelector, this.checked, "sprint-row-selected");

      recalculateSelectedSprintsSum("tasks");
      recalculateSelectedSprintsSum("estimated");
      recalculateSelectedSprintsSum("spent");
      recalculateSelectedSprintsAvg("overtime");
    });
  });

  // recalculate summary for selected sprints
  recalculateSelectedSprintsSum("tasks");
  recalculateSelectedSprintsSum("estimated");
  recalculateSelectedSprintsSum("spent");
  recalculateSelectedSprintsAvg("overtime");
}

/**
 * Set active tab
 */
function setActiveTab(id) {
  var contentSelector = `[data-tab-content-id="${id}"]`;
  var tab = document.querySelector(`[data-tab-header-id="${id}"]`);
  var tabs = document.querySelectorAll(".tab-header");
  var contents = document.querySelectorAll(".tab-content");

  tabs.forEach(function(item) {
    item.classList.remove("active");
  });
  contents.forEach(function(item) {
    item.classList.remove("active");
  })

  // set current tab active
  tab.classList.toggle("active");
  document.querySelector(contentSelector).classList.toggle("active");
}

/**
 * Initializes tabs
 */
function initTabs() {
  var tabs = document.querySelectorAll(".tab-header");

  tabs.forEach(function(tab) {
    var attr = tab.attributes["data-tab-header-id"];

    tab.querySelector("a").onclick = function () {
      setActiveTab(attr.value);
      saveSettings("tabs", {"activeTabId": attr.value});
    }
  });
}

/**
 * Apply tabs settings
 */
function applyTabsSettings() {
  var defaultTabId = 1;
  var tabsSettings = getSettings("tabs");
  var activeTabId = tabsSettings["activeTabId"];
  var availableTabIds = [
    ...document.querySelectorAll("[data-tab-header-id]")].map(
      a => a.attributes["data-tab-header-id"].value
  )

  if (activeTabId && availableTabIds.includes(activeTabId)) {
    setActiveTab(activeTabId);
  } else {
    setActiveTab(defaultTabId);
  }
}

/**
 * Initializes all action parts.
 */
function init_reports() {
  init_highlights();

  init_version_selector();
  init_version_columns();

  init_sprint_selector()
  init_sprint_columns();

  initTabs();

  applyVersionComponentTableSettings();
  applySprintComponentTableSettings();
  applyTabsSettings();
}

document.addEventListener("DOMContentLoaded", init_reports)

export { init_reports };
