const API_URI =
  "https://nguyenvu.store/wp-json/wc/v3/products?consumer_key=ck_ae0f234c096cfe3b6d4c3eafe8d6a78021593c80&consumer_secret=cs_223d9a5a89554c52710f1a63d17f6848d3f9e376";

const fetchProducts = () => {
  fetch(API_URI)
    .then((response) => response.json())
    .then((products) => {
      localStorage.setItem("nguyenvu-product", JSON.stringify(products));
      const carousel = document.querySelector(".carousel");
      const flickity = new Flickity(carousel, {
        groupCells: true,
      });

      products.forEach((product) => {
        const cellElement = document.createElement("div");
        cellElement.className = "carousel-cell";
        cellElement.innerHTML = productElement(product);
        flickity.append(cellElement);
      });
    })
    .catch((error) => {
      console.log("Error fetching products:", error);
    });
};

const productElement = (product) => {
  return `<div class="product-container">
        <div class="product__image" onclick='confirmDialog(${product.id})'>
            <img src="${product.images[0].src}" alt=${product.name}/>
        </div>
        <div class="product__info_text">
            <span>${product.categories[0].name}</span>
            <h2>${product.name}</h2>
            <span class="product__info_price">${formatPriceVND(
              product.price
            )} ₫</span>
        </div>
        <div class="product__button">
            <button>THÊM VÀO GIỎ HÀNG</button>
        </div>
    </div>`;
};

const formatPriceVND = (price) =>
  String(price).replace(/(.)(?=(\d{3})+$)/g, "$1.");

const confirmDialog = (id) => {
  const products = JSON.parse(localStorage.getItem("nguyenvu-product"));
  const product = products.filter((pr) => pr.id === id)[0];
  var dialog = '<div class="dialog confirm mfp-with-anim">';
  dialog += `<div class="dialog-container">

   <div class="dialog__image">
    <img src="${product.images[0].src}" alt="image"/>
   </div>
   <div class="dialog__content">
   <h1>${product.name}</h1>
   <p>${product.description}</p>
   </div>
    <div class="actions">
        <img class="btn-cancel" src="https://cdn-icons-png.flaticon.com/256/3917/3917759.png" alt"logo"/>
    </div>
    </div>
  </div>`;

  dialog += "</div>";

  $.magnificPopup.open({
    modal: true,
    items: {
      src: dialog,
      type: "inline",
    },
    callbacks: {
      open: function () {
        var $content = $(this.content);

        $content.on("click", ".btn-cancel", function () {
          $.magnificPopup.close();
          $(document).off("keydown", keydownHandler);
        });

        var keydownHandler = function (e) {
          if (e.keyCode == 27) {
            $content.find(".btn-cancel").click();
            return false;
          }
        };
        $(document).on("keydown", keydownHandler);
      },
    },
  });
};

window.addEventListener("load", fetchProducts);
