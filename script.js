let slideHienTai = 0;
// Chỉ lấy những thẻ đang có class "slide" (sau khi đã lọc)
let danhSachSlide = document.getElementsByClassName("slide");

// Hàm tiện ích: Nếu input rỗng -> Ẩn element chứa nó và xóa class slide
function kiemTraVaHienThi(inputId, outputId, slideId) {
    let giatri = document.getElementById(inputId).value.trim();
    let slideElement = document.getElementById(slideId);
    
    if (giatri === "") {
        // Nếu rỗng: Xóa class 'slide' để nút Next/Back không đếm trang này
        slideElement.classList.remove("slide");
        slideElement.style.display = "none"; 
    } else {
        // Nếu có dữ liệu: Thêm lại class 'slide' và in dữ liệu ra
        slideElement.classList.add("slide");
        document.getElementById(outputId).innerText = giatri;
    }
}

function batDauTrinhChieu() {
    // 1. Gán dữ liệu cơ bản (những phần bắt buộc phải có)
    document.getElementById("out-ten").innerText = document.getElementById("in-ten").value || "Chưa nhập";
    document.getElementById("out-lydo").innerText = document.getElementById("in-lydo").value;
    document.getElementById("out-benhsu").innerText = document.getElementById("in-benhsu").value;
    document.getElementById("out-khamchung").innerText = document.getElementById("in-khamchung").value;
    document.getElementById("out-chandoan").innerText = document.getElementById("in-chandoan").value.toUpperCase();

    // 2. Ẩn hiện các mục nhỏ trong cùng 1 slide (Ví dụ Tiền sử, CLS)
    document.getElementById("wrap-tiensu").style.display = document.getElementById("in-tiensu").value.trim() ? "block" : "none";
    document.getElementById("out-tiensu").innerText = document.getElementById("in-tiensu").value;
    
    document.getElementById("wrap-cls").style.display = document.getElementById("in-cls").value.trim() ? "block" : "none";
    document.getElementById("out-cls").innerText = document.getElementById("in-cls").value;

    // 3. KIỂM TRA SLIDE CHUYÊN KHOA (Đây là chỗ xử lý Gộp Khoa của anh)
    kiemTraVaHienThi("in-khamngoai", "out-khamngoai", "slide-khamngoai");
    kiemTraVaHienThi("in-khamsan", "out-khamsan", "slide-khamsan");
    kiemTraVaHienThi("in-khamnhi", "out-khamnhi", "slide-khamnhi");

    // Cập nhật lại danh sách slide sau khi đã thêm/bớt class "slide"
    danhSachSlide = document.getElementsByClassName("slide");

    // 4. Chuyển giao diện
    document.getElementById("khu-vuc-nhap-lieu").style.display = "none";
    document.getElementById("khu-vuc-trinh-chieu").style.display = "block";

    let elem = document.documentElement;
    if (elem.requestFullscreen) { elem.requestFullscreen(); }

    slideHienTai = 0;
    hienThiSlide(slideHienTai);
}

function ketThucTrinhChieu() {
    document.getElementById("khu-vuc-trinh-chieu").style.display = "none";
    document.getElementById("khu-vuc-nhap-lieu").style.display = "block";
    if (document.exitFullscreen) { document.exitFullscreen(); }
}

function hienThiSlide(n) {
    for (let i = 0; i < danhSachSlide.length; i++) {
        danhSachSlide[i].style.display = "none"; // Ẩn hết
    }
    if(danhSachSlide[n]) {
        danhSachSlide[n].style.display = "block"; // Chỉ hiện slide hiện tại
    }
}

function chuyenSlide(buoc) {
    let viTriMoi = slideHienTai + buoc;
    if (viTriMoi >= 0 && viTriMoi < danhSachSlide.length) {
        slideHienTai = viTriMoi;
        hienThiSlide(slideHienTai);
    }
}

document.addEventListener('keydown', function(event) {
    if (document.getElementById("khu-vuc-trinh-chieu").style.display === "block") {
        if (event.key === "ArrowRight") chuyenSlide(1);
        else if (event.key === "ArrowLeft") chuyenSlide(-1);
        else if (event.key === "Escape") ketThucTrinhChieu();
    }
});
// --- LOGIC ĐĂNG NHẬP (Tạm thời giả lập Frontend) ---
    function xuLyDangNhap() {
        let user = document.getElementById("login-username").value;
        let pass = document.getElementById("login-password").value;
        
        if(user === "" || pass === "") {
            alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
            return;
        }
        
        // Chuyển từ Đăng nhập sang Chọn khoa
        document.getElementById("khu-vuc-dang-nhap").style.display = "none";
        document.getElementById("khu-vuc-chon-khoa").style.display = "block";
    }

    function dangNhapGoogle() {
        // Sau này sẽ tích hợp API của Google vào đây
        alert("Chức năng Đăng nhập Google sẽ được kích hoạt khi nối với Backend!");
        document.getElementById("khu-vuc-dang-nhap").style.display = "none";
        document.getElementById("khu-vuc-chon-khoa").style.display = "block";
    }

    function dangXuat() {
        document.getElementById("khu-vuc-chon-khoa").style.display = "none";
        document.getElementById("khu-vuc-nhap-lieu").style.display = "none";
        document.getElementById("khu-vuc-dang-nhap").style.display = "flex";
        
        // Xóa text ở ô input đăng nhập
        document.getElementById("login-username").value = "";
        document.getElementById("login-password").value = "";
    }

    // --- LOGIC CHỌN KHOA VÀ VÀO FORM ---
    function vaoFormNhapLieu(tenKhoa) {
        // Tự động gán khoa đã chọn vào ô Select của Form
        let selectKhoa = document.getElementById("in-khoa");
        if(selectKhoa) {
            selectKhoa.value = tenKhoa;
            // Khóa (disable) không cho đổi khoa khác để tránh nhầm lẫn
            selectKhoa.disabled = true; 
        }

        // Chuyển màn hình
        document.getElementById("khu-vuc-chon-khoa").style.display = "none";
        document.getElementById("khu-vuc-nhap-lieu").style.display = "block";
    }