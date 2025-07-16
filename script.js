class SuitmediaIdeas {
  constructor() {
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.sortBy = "-published_at";
    this.totalItems = 0;
    this.ideas = [];
    this.loading = false;
    this.lastScrollY = 0;
    this.imageObserver = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadStateFromURL();
    this.fetchIdeas();
    this.setupIntersectionObserver();
  }

  setupEventListeners() {
    // Scroll event for header and parallax
    window.addEventListener("scroll", this.handleScroll.bind(this));

    // Control events
    document.getElementById("itemsPerPage").addEventListener("change", (e) => {
      this.itemsPerPage = parseInt(e.target.value);
      this.currentPage = 1;
      this.updateURL();
      this.fetchIdeas();
    });

    document.getElementById("sortBy").addEventListener("change", (e) => {
      this.sortBy = e.target.value;
      this.currentPage = 1;
      this.updateURL();
      this.fetchIdeas();
    });

    // Pagination event delegation
    document.getElementById("pagination").addEventListener("click", (e) => {
      if (e.target.classList.contains("page-btn")) {
        const page = parseInt(e.target.dataset.page);
        if (page !== this.currentPage) {
          this.currentPage = page;
          this.updateURL();
          this.fetchIdeas();

          document
            .querySelector(".main-content")
            .scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }

  setupIntersectionObserver() {
    this.imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.removeAttribute("data-src");
              this.imageObserver.unobserve(img);
            }
          }
        });
      },
      { threshold: 0.1 }
    );
  }

  handleScroll() {
    const currentScrollY = window.pageYOffset;
    const header = document.getElementById("header");

    // Header visibility
    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      header.classList.add("hidden");
    } else {
      header.classList.remove("hidden");
    }

    // Header background opacity
    if (currentScrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Parallax effect
    const bannerBg = document.getElementById("bannerBg");
    const bannerContent = document.getElementById("bannerContent");
    const parallaxSpeed = 0.5;

    if (bannerBg && bannerContent) {
      bannerBg.style.transform = `translateY(${
        currentScrollY * parallaxSpeed
      }px)`;
      bannerContent.style.transform = `translateY(${
        currentScrollY * -parallaxSpeed
      }px)`;
    }

    this.lastScrollY = currentScrollY;
  }

  loadStateFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    this.currentPage = parseInt(urlParams.get("page")) || 1;
    this.itemsPerPage = parseInt(urlParams.get("size")) || 10;
    this.sortBy = urlParams.get("sort") || "-published_at";

    // Update controls
    document.getElementById("itemsPerPage").value = this.itemsPerPage;
    document.getElementById("sortBy").value = this.sortBy;
  }

  updateURL() {
    const params = new URLSearchParams();
    params.set("page", this.currentPage);
    params.set("size", this.itemsPerPage);
    params.set("sort", this.sortBy);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }

  async fetchIdeas() {
    this.loading = true;
    this.renderLoading();

    try {
      const url = `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${this.currentPage}&page[size]=${this.itemsPerPage}&append[]=small_image&append[]=medium_image&sort=${this.sortBy}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.ideas = data.data || [];
      this.totalItems = data.meta?.total || 0;
    } catch (error) {
      console.error("Error fetching ideas:", error);
      // Fallback to mock data
      this.ideas = this.generateMockData();
      this.totalItems = 100;
    }

    this.loading = false;
    this.render();
  }

  generateMockData() {
    return Array.from({ length: this.itemsPerPage }, (_, i) => ({
      id: (this.currentPage - 1) * this.itemsPerPage + i + 1,
      title: `Keuali Tingkatan Influencers berdasarkan Jumlah Followers ${
        i + 1
      }`,
      small_image: [
        {
          url: `https://picsum.photos/300/200?random=${
            (this.currentPage - 1) * this.itemsPerPage + i + 1
          }`,
        },
      ],
      published_at: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
    }));
  }

  renderLoading() {
    const grid = document.getElementById("ideasGrid");
    grid.innerHTML = "";

    for (let i = 0; i < this.itemsPerPage; i++) {
      const skeletonCard = document.createElement("div");
      skeletonCard.className = "idea-card";
      skeletonCard.innerHTML = `
                <div class="skeleton-image skeleton"></div>
                <div class="idea-content">
                    <div class="skeleton-text skeleton"></div>
                    <div class="skeleton-text skeleton short"></div>
                </div>
            `;
      grid.appendChild(skeletonCard);
    }
  }

  render() {
    this.renderIdeas();
    this.renderPagination();
    this.updateStatusText();
  }

  renderIdeas() {
    const grid = document.getElementById("ideasGrid");
    grid.innerHTML = "";

    this.ideas.forEach((idea) => {
      const card = document.createElement("div");
      card.className = "idea-card";

      //   // AMBIL URL ASLI DARI API
      //   let imageUrl = idea.small_image?.[0]?.url || "";

      //   // PENGECEKAN DAN PERBAIKAN URL
      //   if (imageUrl && imageUrl.startsWith("/")) {
      //     imageUrl = "https://suitmedia-backend.suitdev.com" + imageUrl;
      //   } else if (!imageUrl) {
      //     imageUrl = "https://via.placeholder.com/300x200?text=No+Image";
      //   }

      // solusi sementara
      const imageUrl = `https://picsum.photos/300/200?random=${idea.id}`;

      const formattedDate = new Date(idea.published_at).toLocaleDateString(
        "id-ID",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );

      card.innerHTML = `
                <div class="idea-image">
                    <img data-src="${imageUrl}" alt="${idea.title}" style="opacity: 0;">
                    <div class="placeholder">Loading...</div>
                </div>
                <div class="idea-content">
                    <h3 class="idea-title">${idea.title}</h3>
                    <p class="idea-date">${formattedDate}</p>
                </div>
            `;

      grid.appendChild(card);

      // Setup lazy loading
      const img = card.querySelector("img");
      const placeholder = card.querySelector(".placeholder");

      img.onload = () => {
        img.style.opacity = "1";
        placeholder.style.display = "none";
      };

      // Menambahkan error handler jika gambar tetap gagal dimuat
      img.onerror = () => {
        placeholder.textContent = "Image failed to load";
      };

      this.imageObserver.observe(img);
    });
  }

  renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    if (totalPages <= 1) return;

    // Helper function untuk membuat tombol
    const createButton = (
      text,
      page,
      isDisabled = false,
      isActive = false,
      isEllipsis = false
    ) => {
      if (isEllipsis) {
        const ellipsis = document.createElement("span");
        ellipsis.className = "ellipsis";
        ellipsis.textContent = "...";
        return ellipsis;
      }

      const button = document.createElement("button");
      button.className = "page-btn";
      button.innerHTML = text;
      button.dataset.page = page;
      button.disabled = isDisabled;
      if (isActive) {
        button.classList.add("active");
      }
      return button;
    };

    const currentPage = this.currentPage;
    const pagesToShow = [];

    // Tombol Pertama (<<) dan Sebelumnya (<)
    pagination.appendChild(createButton("&laquo;", 1, currentPage === 1));
    pagination.appendChild(
      createButton("&lsaquo;", currentPage - 1, currentPage === 1)
    );

    // Logika untuk menampilkan nomor halaman dan elipsis (...)
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pagesToShow.push(i);
      }
    } else {
      pagesToShow.push(1);
      if (currentPage > 3) {
        pagesToShow.push("...");
      }
      if (currentPage > 2) {
        pagesToShow.push(currentPage - 1);
      }
      if (currentPage !== 1 && currentPage !== totalPages) {
        pagesToShow.push(currentPage);
      }
      if (currentPage < totalPages - 1) {
        pagesToShow.push(currentPage + 1);
      }
      if (currentPage < totalPages - 2) {
        pagesToShow.push("...");
      }
      pagesToShow.push(totalPages);
    }

    // Render tombol nomor halaman
    const uniquePages = [...new Set(pagesToShow)];
    uniquePages.forEach((page) => {
      if (page === "...") {
        pagination.appendChild(createButton("", 0, false, false, true));
      } else {
        pagination.appendChild(
          createButton(page, page, false, page === currentPage)
        );
      }
    });

    // Tombol Selanjutnya (>) dan Terakhir (>>)
    pagination.appendChild(
      createButton("&rsaquo;", currentPage + 1, currentPage === totalPages)
    );
    pagination.appendChild(
      createButton("&raquo;", totalPages, currentPage === totalPages)
    );
  }

  updateStatusText() {
    const statusText = document.getElementById("statusText");
    const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endItem = Math.min(
      this.currentPage * this.itemsPerPage,
      this.totalItems
    );

    statusText.textContent = `Showing ${startItem} - ${endItem} of ${this.totalItems}`;
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  new SuitmediaIdeas();
});
