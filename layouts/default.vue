<template>
  <div class="app-layout">
    <header class="app-header">
      <h1 class="app-title">Work Schedule</h1>
    </header>
    <main class="app-content">
      <slot />
    </main>
  </div>
</template>

<style>
:root {
  --bg-color: #f5f7fa;
  --text-color: #333333;
  --primary-color: #3498db;
  --card-bg-color: #ffffff;
  --card-border-color: #e0e0e0;
  --card-bg-color-office: #f0f4f8;
  --card-bg-color-home: #f4f8f0;
}

body {
  font-family: Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  margin: 0;
  padding: 0;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem;
  text-align: center;
}

.app-title {
  margin: 0;
  font-size: 1.5rem;
}

.app-content {
  flex-grow: 1;
  padding: 1rem;
}
</style>