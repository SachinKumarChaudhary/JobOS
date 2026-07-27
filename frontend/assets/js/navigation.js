function closeSidebar() {
  document.getElementById('sidebarOverlay')?.classList.remove('open');
}
document.querySelectorAll('.screen-nav a').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('.screen-nav a').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    closeSidebar();
  });
});
