let cart = [];

// Toast popup
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 2500);
}

// Tambah ke keranjang
function addToCart(name, price, isPulsa = false) {
  let existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name, price, qty: 1, isPulsa });
  }
  updateCart();

  // Toast
  showToast("✅ Produk telah ditambahkan di keranjang, silahkan cek keranjang!");
}

// Update keranjang
function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const totalPrice = document.getElementById("totalPrice");
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    let li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x${item.qty} - Rp ${(item.price * item.qty).toLocaleString()}
      <button class="remove-btn" onclick="removeFromCart(${index})">❌</button>
    `;
    cartItems.appendChild(li);
    total += item.price * item.qty;
  });

  totalPrice.textContent = total.toLocaleString();
}

// Hapus item
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
  showToast("🗑️ Produk dihapus dari keranjang");
}

// Sidebar toggle
const cartSidebar = document.getElementById("cartSidebar");
document.getElementById("floatingCartBtn").onclick = () => {
  cartSidebar.classList.toggle("active");
};

// Checkout
document.getElementById("checkoutForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("buyerName").value.trim();
  const kelas = document.getElementById("buyerClass").value.trim();
  const note = document.getElementById("buyerNote").value.trim();

  if (!name || !kelas) {
    showToast("⚠️ Nama dan Kelas wajib diisi!");
    return;
  }

  const hasPulsa = cart.some(item => item.isPulsa);
  if (hasPulsa && !note) {
    showToast("⚠️ Anda membeli pulsa/kuota, keterangan WAJIB diisi!");
    return;
  }

  document.getElementById("waOptions").style.display = "block";

  function buildMessage() {
    if (cart.length === 0) {
      return encodeURIComponent("🛒 Keranjang kosong, belum ada pesanan.");
    }

    let total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    let orderList = cart.map(item => 
      `- ${item.name} x${item.qty} (Rp ${(item.price * item.qty).toLocaleString()})`
    ).join("\n");

    let message = 
`🌟 Halo Admin RuzStore! 🌟

Saya ingin melakukan pemesanan:

🛒 Pesanan:
${orderList}

💰 Total: Rp ${total.toLocaleString()}
👤 Nama: ${name}
🏫 Kelas: ${kelas}
📝 Keterangan: ${note || "-"}

🙏 Mohon diproses ya, terima kasih!`;

    return encodeURIComponent(message);
  }

  document.getElementById("waElbon").onclick = function() {
    this.href = `https://wa.me/6283825146838?text=${buildMessage()}`;
  };
  document.getElementById("waHaeru").onclick = function() {
    this.href = `https://wa.me/6285179599831?text=${buildMessage()}`;
  };

  showToast("✅ Pesanan siap, pilih admin WhatsApp untuk konfirmasi!");
});
