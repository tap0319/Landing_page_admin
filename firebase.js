// firebase.js (Classic CDN style)
const firebaseConfig = {
  apiKey: "AIzaSyD1ndfwxJSO1xAa48rl4TqfOMG29lIXlYs",
  authDomain: "fastfoodorders.firebaseapp.com",
  projectId: "fastfoodorders",
  storageBucket: "fastfoodorders.appspot.com",
  messagingSenderId: "360724453530",
  appId: "1:360724453530:web:ef2fb45390b42e034f2723"
};

// ✅ Initialize Firebase (no import)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ...firebase config and init

document.addEventListener("DOMContentLoaded", () => {
  const orderForm = document.getElementById("orderForm");
  if (!orderForm) return;

  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const item = document.getElementById("details").value.trim();
    const address = document.getElementById("address").value.trim();
    const email = document.getElementById("email").value.trim();

    



    if (!name || !phone || !item || !address) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const docRef = await db.collection("orders").add({
        name,
        phone,
        item,
        address,
        status: "pending",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      localStorage.setItem("myOrderId", docRef.id);

      showReceipt({
        name,
        phone,
        item,
        address,
        orderId: docRef.id,
        time: new Date().toLocaleString()
      });

      orderForm.reset();

      // moved here - listen  dor admin confirmation
      db.collection("orders").doc(docRef.id).onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          if (data.status === "confirmed") {
            showConfirmationNotification();
            localStorage.removeItem("myOrderId");
          }
        }
      });


    } catch (err) {
      console.error("Error saving order:", err);
      alert(" Failed to save order.");
    }
  });
});

// ✅ Outside the event listener — GLOBAL
function showReceipt({ name, phone, item, address, orderId, time }) {
  const receiptHtml = `
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Order:</strong> ${item}</p>
    <p><strong>Address:</strong> ${address}</p>
    <p><strong>Time:</strong> ${time}</p>
  `;

  document.getElementById("receiptContent").innerHTML = receiptHtml;
  document.getElementById("receiptPopup").style.display = "block";
}

// ✅ GLOBAL download function
function downloadReceipt() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const text = document.getElementById("receiptContent").innerText;
  const lines = text.split("\n");

  doc.setFontSize(14);
  doc.text("FastFood Super Express Receipt", 20, 20);

  let y = 40;
  lines.forEach(line => {
    doc.text(line.trim(), 20, y);
    y += 10;
  });

  doc.save("FastFood_Receipt.pdf");
}

function showConfirmationNotification() {
  const notif = document.createElement("div");
  notif.className = "confirmation-toast"; // Add class instead of inline style
  notif.textContent = "✅ Your order has been accepted by admin!";
  document.body.appendChild(notif);

  setTimeout(() => notif.remove(), 5000);
}
