<!-- admin.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin – Orders</title>
  <link rel="stylesheet" href="style.css">
   <!-- Firebase CDN scripts (BEFORE firebase.js and admin.js) -->
  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>
  <!--admin logic-->
  <script src="admin.js" defer></script>    <!-- for admin.html -->

</head>
<body>
  <h1>Order Dashboard</h1>
  <div id="ordersContainer">Loading…</div>
  <div id="editSection" style="display:none; margin-top: 2rem;">
  <h2>Edit Order</h2>
  <form id="editForm">
    <input type="hidden" id="editId">
    <input type="text" id="editName" placeholder="Name" required />
    <input type="text" id="editPhone" placeholder="Phone" required />
    <input type="text" id="editItem" placeholder="Item" required />
    <input type="text" id="editAddress" placeholder="Address" required />
    <button type="submit">Update Order</button>
  </form>
</div>

</body>
</html>
  
