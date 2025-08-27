let cart = [];

// Tambah ke keranjang
function addToCart(name, price, isPulsa = false) {
  // Jika barang sudah ada di keranjang, tambah qty
  let existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name, price, qty: 1, isPulsa });
  }
  updateCart();
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
      <button class="remove-btn" onclick="removeFromCart(${index})">❌ Hapus</button>
    `;
    cartItems.appendChild(li);
    total += item.price * item.qty;
  });

  totalPrice.textContent = total.toLocaleString();
}

// Hapus item dari keranjang
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Cart Sidebar
const cartSidebar = document.getElementById("cartSidebar");
document.getElementById("openCartBtn").onclick = () => cartSidebar.classList.add("active");
document.getElementById("closeCartBtn").onclick = () => cartSidebar.classList.remove("active");

// Checkout
// Checkout
document.getElementById("checkoutForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("buyerName").value.trim();
  const kelas = document.getElementById("buyerClass").value.trim();
  const note = document.getElementById("buyerNote").value.trim();

  if (!name || !kelas) {
    alert("Nama dan Kelas wajib diisi!");
    return;
  }

  // Jika ada item pulsa/kuota, wajib isi keterangan
  const hasPulsa = cart.some(item => item.isPulsa);
  if (hasPulsa && !note) {
    alert("Anda membeli pulsa/kuota, keterangan WAJIB diisi!");
    return;
  }

  // Tampilkan pilihan admin WA
  document.getElementById("waOptions").style.display = "block";

  // Event listener untuk WA buttons agar selalu ambil data terbaru
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
});

