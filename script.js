// API endpoint ของ JSON Server
const API = "https://my-json-server.typicode.com/oatkub137/fansite";

// บันทึก blog ใหม่
async function saveBlog() {
  const imageFile = document.getElementById("image").files[0];
  const text = document.getElementById("text").value;
  const date = document.getElementById("date").value;

  if (!imageFile || !text || !date) {
    alert("กรอกข้อมูลให้ครบก่อนนะ ❤️");
    return;
  }

  // แปลงรูปเป็น Base64
  const reader = new FileReader();
  reader.onload = async function(e) {
    const imageBase64 = e.target.result;

    const newBlog = {
      image: imageBase64,
      text: text,
      date: date,
      createdAt: Date.now()
    };

    // ส่งข้อมูลไป JSON Server
    await fetch(`${API}/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBlog)
    });

    alert("บันทึกเรียบร้อย ❤️");

    // รีเซ็ตฟอร์ม
    document.getElementById("image").value = "";
    document.getElementById("text").value = "";
    document.getElementById("date").value = "";

    loadBlogs();
  };

  reader.readAsDataURL(imageFile);
}

// โหลด blog ทั้งหมด
async function loadBlogs() {
  const blogList = document.getElementById("blogList");
  blogList.innerHTML = "";

  const res = await fetch(`${API}/blogs`);
  const blogs = await res.json();

  blogs
    .sort((a, b) => b.createdAt - a.createdAt)
    .forEach(b => {
      blogList.innerHTML += `
        <div class="blog-card">
          <img src="${b.image}">
          <p>${b.text}</p>
          <div class="date">📅 ${b.date}</div>
        </div>
      `;
    });
}

// โหลด blog เมื่อเปิดหน้า
loadBlogs();