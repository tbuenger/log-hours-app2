<template>
  <div>
    <header>
      <h1>Work Hours Tracker</h1>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
header {
  background-color: #4a90e2;
  color: white;
  padding: 1rem;
  text-align: center;
}

main {
  padding: 1rem;
}
</style>