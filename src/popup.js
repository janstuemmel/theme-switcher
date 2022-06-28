function getThemes() {
  return browser.management.getAll().then(extensions => 
    extensions.filter((extension) => extension.type === 'theme')
  );
}

async function appendSelectOptions(node, themes, theme) {
  const themeId = await getSelectedTheme(theme);
  themes.forEach((theme) => {
    const option = document.createElement('option');
    option.textContent = theme.name;
    option.value = theme.id;
    option.selected = themeId == theme.id;
    node.appendChild(option);
  })
}

function getSelectedTheme(key) {
  return browser.storage.local.get().then(res => res[key])
}

function saveSelectTheme(key) {
  return function(evt) {
    evt.preventDefault();
    browser.storage.local.set({
      [key]: evt.target.value,
    });
  };
}

async function switchTheme(evt) {
  evt.preventDefault();
  const matchesDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = await getSelectedTheme(matchesDark ? 'light' : 'dark');
  if (theme) {
    await browser.management.setEnabled(theme, true);
  }
  window.close()
}

async function init() {
  // nodes
  const lightThemesSelect = document.getElementById('light-themes');
  const darkThemesSelect = document.getElementById('dark-themes');
  const switchThemesButton = document.getElementById('switch-themes');

  // add select options
  const themes = await getThemes();
  appendSelectOptions(lightThemesSelect, themes, 'light');
  appendSelectOptions(darkThemesSelect, themes, 'dark');
  
  // listeners
  lightThemesSelect.addEventListener('change', saveSelectTheme('light'));
  darkThemesSelect.addEventListener('change', saveSelectTheme('dark'));
  switchThemesButton.addEventListener('click', switchTheme);
}

document.addEventListener('DOMContentLoaded', init);
