// admin.js

const firebaseConfig = {
  apiKey: "AIzaSyD1ndfwxJSO1xAa48rl4TqfOMG29lIXlYs",
  authDomain: "fastfoodorders.firebaseapp.com",
  projectId: "fastfoodorders",
  storageBucket: "fastfoodorders.appspot.com",
  messagingSenderId: "360724453530",
  appId: "1:360724453530:web:ef2fb45390b42e034f2723"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("ordersContainer");

  // 🔁 Fetch orders
  db.collection("orders").orderBy("timestamp", "desc").onSnapshot(snapshot => {
    container.innerHTML = "";
    if (snapshot.empty) {
      container.innerHTML = "<p>No orders found.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "order-entry";

      div.innerHTML = `
        <h3>${data.name}</h3>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Order:</strong> ${data.item}</p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Status:</strong> ${data.status || "pending"}</p>
        <p><strong>Time:</strong> ${data.timestamp?.toDate().toLocaleString() || "Pending"}</p>
        <button class="confirm-btn ${data.status === "confirmed" ? "confirmed" : ""}" ${data.status === "confirmed" ? "disabled" : ""}>
          ${data.status === "confirmed" ? "✔ Confirmed" : "Confirm"}
        </button>
        <button class="delete-btn">Delete</button>
        <button class="edit-btn" ${data.status === "confirmed" ? "disabled" : ""}>Edit</button>
      `;

      container.appendChild(div);

      // ✅ Confirm Button Logic
      const confirmBtn = div.querySelector(".confirm-btn");
      confirmBtn.addEventListener("click", async () => {
        try {
          await db.collection("orders").doc(doc.id).update({ status: "confirmed" });
          confirmBtn.textContent = "✔ Confirmed";
          confirmBtn.classList.add("confirmed");
          confirmBtn.disabled = true;
          alert("✅ Order confirmed!");
        } catch (err) {
          console.error("Failed to confirm:", err);
        }

          await emailjs.send("your_service_id", "template_confirmed", {
          to_name: data.name,
          to_email: data.email, // Add email field to form and Firestore if not yet added
          order_id: doc.id,
          item: data.item
});

      });

      // 🗑️ Delete Logic
      div.querySelector(".delete-btn").addEventListener("click", async () => {
        const confirmDelete = confirm("Are you sure you want to delete this order?");
        if (!confirmDelete) return;
        try {
          await db.collection("orders").doc(doc.id).delete();
          alert("🗑️ Order deleted!");
        } catch (err) {
          console.error("Delete failed:", err);
        }
      });

      // ✏️ Edit Button Logic
      div.querySelector(".edit-btn").addEventListener("click", () => {
        if (data.status === "confirmed") {
          alert("❌ Cannot edit a confirmed order.");
          return;
        }

        document.getElementById("editId").value = doc.id;
        document.getElementById("editName").value = data.name;
        document.getElementById("editPhone").value = data.phone;
        document.getElementById("editItem").value = data.item;
        document.getElementById("editAddress").value = data.address;
        document.getElementById("editSection").style.display = "block";
      });
    });
  });

  // ✍️ Handle Edit Form Submission
  document.getElementById("editForm").addEventListener("submit", async function (e) {
       e.preventDefault();
       const id = document.getElementById("editId").value;
       const updatedData = {
       name: document.getElementById("editName").value,
       phone: document.getElementById("editPhone").value,
       item: document.getElementById("editItem").value,
       address: document.getElementById("editAddress").value,
    };

    try {
      await db.collection("orders").doc(id).update(updatedData);
      alert("✅ Order updated!");
      document.getElementById("editSection").style.display = "none";
    } catch (err) {
      console.error("Edit failed:", err);
      alert("❌ Failed to update.");
    }
  });
});
