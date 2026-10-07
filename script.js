document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");
  const navLinks = [...document.querySelectorAll(".primary-nav a[href^='#']")];
  const sections = [...document.querySelectorAll("main section[id]")].filter((section) =>
    navLinks.some((link) => link.getAttribute("href") === `#${section.id}`)
  );
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  if (root.classList.contains("hero-loading") && !reduceMotion) {
    requestAnimationFrame(() => {
      root.classList.add("hero-play");
    });

    window.setTimeout(() => {
      const identity = document.querySelector(".hero-identity");
      const first = identity ? identity.getBoundingClientRect() : null;
      root.classList.add("hero-split");

      if (identity && first) {
        const last = identity.getBoundingClientRect();
        const dx = first.left - last.left;
        const dy = first.top - last.top;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          identity.animate(
            [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],
            { duration: 900, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
          );
        }
      }
    }, 1650);

    window.setTimeout(() => {
      root.classList.remove("hero-loading", "hero-play", "hero-split");
      root.classList.add("hero-done");
    }, 3200);
  } else {
    root.classList.remove("hero-loading", "hero-split");
    root.classList.add("hero-done");
  }

  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  const openMenu = () => {
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  };

  toggle.addEventListener("click", () => {
    nav.classList.contains("is-open") ? closeMenu() : openMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) closeMenu();
  });

  const setActiveLink = () => {
    const offset = window.scrollY + 120;
    let current = "home";

    sections.forEach((section) => {
      if (section.offsetTop <= offset) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${current}`;
      link.classList.toggle("active", isActive);
    });
  };

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  const focusIds = ["all", "software", "data", "ai"];
  const focusLabels = {
    software: "Software Engineering",
    data: "Data & BI",
    ai: "AI / ML"
  };
  const focusTabs = [...document.querySelectorAll(".focus-tab")];
  const projectCards = [...document.querySelectorAll(".project-card")];
  const projectGrid = document.querySelector(".project-grid");

  const readFocus = () => {
    const value = document.documentElement.dataset.focus || new URLSearchParams(window.location.search).get("focus");
    return focusIds.includes(value) ? value : "all";
  };

  let focusFrame = 0;

  const applyFocus = (focus, historyMode) => {
    const next = focusIds.includes(focus) ? focus : "all";
    const frame = ++focusFrame;
    document.documentElement.dataset.focus = next;

    focusTabs.forEach((tab) => {
      const selected = tab.dataset.focus === next;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-pressed", String(selected));
    });

    const paint = () => {
      projectCards.forEach((card) => {
        const orderKey = `order${next.charAt(0).toUpperCase()}${next.slice(1)}`;
        card.style.order = card.dataset[orderKey] || "0";
        const lenses = (card.dataset.focus || "").split(/\s+/);
        const relevant = next === "all" || lenses.includes(next);
        card.classList.toggle("is-dimmed", next !== "all" && !relevant);
        card.classList.toggle("is-primary", next !== "all" && card.dataset.primaryFocus === next);
        const lens = card.querySelector(".project-lens");
        if (!lens) return;
        if (next !== "all" && relevant) {
          lens.hidden = false;
          lens.textContent = focusLabels[next];
        } else {
          lens.hidden = true;
          lens.textContent = "";
        }
      });
    };

    if (!reduceMotion && projectGrid) {
      projectGrid.classList.add("is-reordering");
      window.setTimeout(() => {
        if (frame !== focusFrame) return;
        paint();
        window.setTimeout(() => {
          if (frame === focusFrame) projectGrid.classList.remove("is-reordering");
        }, 40);
      }, 120);
    } else {
      paint();
    }

    if (historyMode === "push") {
      const url = new URL(window.location.href);
      if (next === "all") url.searchParams.delete("focus");
      else url.searchParams.set("focus", next);
      history.pushState({ focus: next }, "", url);
    }
  };

  focusTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      if (tab.dataset.focus === (document.documentElement.dataset.focus || "all")) return;
      applyFocus(tab.dataset.focus, "push");
    });

    tab.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : event.key === "Home" ? -index : focusTabs.length - 1 - index;
      const target = focusTabs[(index + delta + focusTabs.length) % focusTabs.length];
      target.focus();
      target.click();
    });
  });

  window.addEventListener("popstate", () => {
    const value = new URLSearchParams(window.location.search).get("focus");
    applyFocus(focusIds.includes(value) ? value : "all");
  });

  applyFocus(readFocus());

  document.querySelectorAll(".impact-toggle").forEach((button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) return;

    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      const label = button.querySelector(".impact-toggle-label");
      const icon = button.querySelector(".impact-toggle-icon");
      if (label) label.textContent = open ? "Show less" : "View more impact";
      if (icon) icon.textContent = open ? "↑" : "↓";
      panel.hidden = !open;
    });
  });

  if (!reduceMotion && !CSS.supports("animation-timeline", "view()")) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  } else if (reduceMotion) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  const metricValues = [...document.querySelectorAll(".metric-value[data-count]")];
  const metricsStrip = document.querySelector(".metrics-strip");

  if (!reduceMotion && metricsStrip && metricValues.length) {
    const paintMetric = (el, value) => {
      const target = Number(el.dataset.count);
      const decimals = (String(target).split(".")[1] || "").length;
      const suffix = el.dataset.suffix || "";
      const shown = decimals ? value.toFixed(decimals) : String(Math.round(value));
      el.textContent = shown + suffix;
    };

    const countMetric = (el) => {
      const target = Number(el.dataset.count);
      const duration = 1200;
      const start = performance.now();
      cancelAnimationFrame(el._countFrame || 0);
      paintMetric(el, 0);

      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        paintMetric(el, target * eased);
        if (progress < 1) el._countFrame = requestAnimationFrame(tick);
      };

      el._countFrame = requestAnimationFrame(tick);
    };

    let ready = true;
    const metricsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && ready) {
            ready = false;
            metricValues.forEach(countMetric);
          } else if (!entry.isIntersecting) {
            ready = true;
          }
        });
      },
      { threshold: 0.4 }
    );

    metricsObserver.observe(metricsStrip);
  }

  if (reduceMotion) {
    return;
  }

  const hero = document.querySelector(".hero-intro");
  const shapes = [...document.querySelectorAll(".hero-shape[data-repel]")];
  if (!hero || !shapes.length) return;

  const pointer = { x: 0, y: 0, active: false };
  const motion = shapes.map(() => ({ x: 0, y: 0, s: 1 }));
  const desktopQuery = window.matchMedia("(min-width: 769px)");

  const onPointerMove = (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  };

  const onPointerLeave = () => {
    pointer.active = false;
  };

  const syncPointerListeners = () => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerleave", onPointerLeave);
    if (desktopQuery.matches) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    } else {
      pointer.active = false;
    }
  };

  syncPointerListeners();
  desktopQuery.addEventListener("change", syncPointerListeners);

  const tick = () => {
    const allowRepel = desktopQuery.matches && pointer.active;

    shapes.forEach((shape, index) => {
      const rect = shape.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let targetX = 0;
      let targetY = 0;
      let targetScale = 1;

      if (allowRepel) {
        const dx = cx - pointer.x;
        const dy = cy - pointer.y;
        const dist = Math.hypot(dx, dy);
        const radius = Math.max(rect.width, rect.height) / 2;
        const influence = 160;

        if (dist < influence && dist > 0.001) {
          const hovering = dist < radius + 10;
          const strength = hovering ? 1 : 1 - dist / influence;
          const max = hovering ? 30 : 24;
          targetX = (dx / dist) * max * strength;
          targetY = (dy / dist) * max * strength;
          targetScale = hovering ? 1.02 : 1;
        }
      }

      const current = motion[index];
      current.x += (targetX - current.x) * 0.08;
      current.y += (targetY - current.y) * 0.08;
      current.s += (targetScale - current.s) * 0.08;
      shape.style.transform = `translate(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px) scale(${current.s.toFixed(3)})`;
    });

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
});
