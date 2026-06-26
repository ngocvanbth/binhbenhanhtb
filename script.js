const firebaseConfig = {
            apiKey: "AIzaSyB89PLFWQWiJZ3KLCY4l1rw0t9QK-JtimY",
            authDomain: "binhbenhanhtb.firebaseapp.com",
            databaseURL: "https://binhbenhanhtb-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "binhbenhanhtb",
            storageBucket: "binhbenhanhtb.firebasestorage.app",
            messagingSenderId: "755374522439",
            appId: "1:755374522439:web:0235e74c65067da7bf3162",
            measurementId: "G-JTC6F5KE82"
        };

        firebase.initializeApp(firebaseConfig);
        const db = firebase.database();

        let loaiFormHienTai = 'BA'; 
        let slideHienTai = 0;
        let danhSachSlide = [];
        let trangThaiDaLuu = false; 
        let maHoSoHienTai = "";
        let duLieuTamThoi = []; 

        const cauHinhLoaiForm = {
            BA: { suffix: '-ba', formId: 'khu-vuc-nhap-lieu-ba', path: 'DanhSachBenhAn', maPrefix: 'BA-', inputTen: 'in-ten-benh-ba', inputMatKhau: 'in-mat-khau-ba', inputNguoi: 'in-nguoi-trinh-bay-ba', inputKhoa: 'in-khoa-ba', hienThi: 'hien-thi-ten-benh-ba', prefixHienThi: 'TÊN BỆNH: ', tenChucNang: 'Bệnh án', titleTimKiem: '🔍 QUẢN LÝ BỆNH ÁN ĐÃ LƯU' },
            DT: { suffix: '-dt', formId: 'khu-vuc-nhap-lieu-dt', path: 'DanhSachDonThuoc', maPrefix: 'DT-', inputTen: 'in-ten-benh-dt', inputMatKhau: 'in-mat-khau-dt', inputNguoi: 'in-nguoi-trinh-bay-dt', inputKhoa: 'in-khoa-dt', hienThi: 'hien-thi-ten-benh-dt', prefixHienThi: 'THÔNG TIN ĐƠN THUỐC: ', tenChucNang: 'Đơn thuốc', titleTimKiem: '🔍 QUẢN LÝ ĐƠN THUỐC ĐÃ LƯU' },
            LT: { suffix: '-lt', formId: 'khu-vuc-nhap-lieu-lt', path: 'DanhSachLyThuyet', maPrefix: 'LT-', inputTen: 'in-ten-benh-lt', inputMatKhau: 'in-mat-khau-lt', inputNguoi: 'in-nguoi-trinh-bay-lt', inputKhoa: 'in-khoa-lt', hienThi: 'hien-thi-ten-benh-lt', prefixHienThi: 'CHỦ ĐỀ LÝ THUYẾT: ', tenChucNang: 'Lý thuyết', titleTimKiem: '🔍 QUẢN LÝ PHẦN LÝ THUYẾT ĐÃ LƯU' }
        };

        const mucLyThuyetCoSan = [
            { key: 'mucTieu', id: 'in-lt-muctieu', tieuDe: '🎯 I. MỤC TIÊU BÀI HỌC' },
            { key: 'daiCuong', id: 'in-lt-daiduong', tieuDe: '📌 II. ĐẠI CƯƠNG / KHÁI NIỆM' },
            { key: 'nguyenNhan', id: 'in-lt-nguyennhan', tieuDe: '🧬 III. NGUYÊN NHÂN / CƠ CHẾ / YẾU TỐ NGUY CƠ' },
            { key: 'lamSang', id: 'in-lt-lamsang', tieuDe: '🩺 IV. TRIỆU CHỨNG LÂM SÀNG' },
            { key: 'canLamSang', id: 'in-lt-canlamsang', tieuDe: '🔬 V. CẬN LÂM SÀNG / CHẨN ĐOÁN' },
            { key: 'dieuTri', id: 'in-lt-dieutri', tieuDe: '💊 VI. ĐIỀU TRỊ / CHĂM SÓC / THEO DÕI' },
            { key: 'phongBenh', id: 'in-lt-phongbenh', tieuDe: '🛡️ VII. PHÒNG BỆNH / GIÁO DỤC SỨC KHỎE' },
            { key: 'banLuan', id: 'in-lt-banluan', tieuDe: '💡 VIII. GHI NHỚ / CÂU HỎI THẢO LUẬN' }
        ];

        function layCauHinhLoai(loai = loaiFormHienTai) { return cauHinhLoaiForm[loai] || cauHinhLoaiForm.BA; }
        function layGiaTri(id) { return (document.getElementById(id)?.value || '').trim(); }
        function ganGiaTri(id, val) { const el = document.getElementById(id); if(el) el.value = val || ''; }
        function escapeHtml(text) {
            return String(text || '').replace(/[&<>"']/g, function(ch) {
                return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
            });
        }

        // KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP KHI MỞ/TẢI LẠI TRANG
        window.onload = function() {
            if(localStorage.getItem("daDangNhap") === "true") {
                document.getElementById("khu-vuc-dang-nhap").style.display = "none";
                document.getElementById("khu-vuc-chon-chuc-nang").style.display = "block";
            }
        };

        function xuLyDangNhap() {
            localStorage.setItem("daDangNhap", "true");
            document.getElementById("khu-vuc-dang-nhap").style.display = "none";
            document.getElementById("khu-vuc-chon-chuc-nang").style.display = "block";
        }

        function dangXuat() { 
            localStorage.removeItem("daDangNhap");
            location.reload(); 
        }

        function anTatCaFormNhapLieu() {
            Object.values(cauHinhLoaiForm).forEach(cfg => {
                const form = document.getElementById(cfg.formId);
                if(form) form.style.display = "none";
            });
        }

        function quayLaiMenu() {
            anTatCaFormNhapLieu();
            document.getElementById("khu-vuc-chon-chuc-nang").style.display = "block";
        }
        
        function vaoFormNhapLieu(loai) {
            document.getElementById("khu-vuc-chon-chuc-nang").style.display = "none";
            loaiFormHienTai = loai;
            maHoSoHienTai = ""; 
            trangThaiDaLuu = false;
            anTatCaFormNhapLieu();
            const cfg = layCauHinhLoai(loai);
            document.getElementById(cfg.formId).style.display = "block";
            capNhatTieuDeBenh();
        }
        
        function xoaDong(btn) { btn.closest('.dynamic-row')?.remove(); }

        // ==========================================
        // CÔNG CỤ NÉN ẢNH CHỐNG NẶNG MÁY
        // ==========================================
        function nenAnh(file, callback) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(event) {
                const img = new Image();
                img.src = event.target.result;
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200; const MAX_HEIGHT = 1200;
                    let width = img.width; let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                    } else {
                        if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                    }
                    canvas.width = width; canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    callback(dataUrl);
                }
            }
        }

        // ==========================================
        // KHU VỰC THÊM HÌNH ẢNH MỚI (COPY/PASTE)
        // ==========================================
        function themDongAnh(savedBase64 = "", savedGhiChu = "") {
            let div = document.createElement("div"); 
            div.className = "dynamic-row row-anh";
            div.style.flexDirection = "column";

            div.innerHTML = `
                <div style="display: flex; gap: 10px; width: 100%;">
                    <div class="paste-zone" tabindex="0">
                        <div class="paste-icon">📸</div>
                        <span class="paste-text">Click chọn ảnh<br>hoặc Nhấn Ctrl+V dán vào đây</span>
                        <input type="file" style="display:none;" accept="image/*" class="file-anh-hidden">
                        <img src="${savedBase64}" class="preview-img" style="display: ${savedBase64 ? 'block' : 'none'};">
                        <textarea class="base64-data" style="display:none;">${savedBase64}</textarea>
                    </div>
                    <div style="flex: 2;">
                        <textarea class="txt-ghichu" rows="4" placeholder="Nhập ghi chú cho hình này..." style="width: 100%; height: 100%; resize: none;">${savedGhiChu}</textarea>
                    </div>
                    <button class="btn-delete-row" onclick="xoaDong(this)" style="height: fit-content;">Xóa</button>
                </div>
            `;

            let pasteZone = div.querySelector('.paste-zone');
            let fileInput = div.querySelector('.file-anh-hidden');
            let imgPreview = div.querySelector('.preview-img');
            let base64Data = div.querySelector('.base64-data');
            let iconText = div.querySelector('.paste-icon');
            let spanText = div.querySelector('.paste-text');

            if(savedBase64) { iconText.style.display = 'none'; spanText.style.display = 'none'; }

            pasteZone.addEventListener('click', () => { fileInput.click(); });

            fileInput.addEventListener('change', function(e) {
                if (e.target.files && e.target.files[0]) {
                    nenAnh(e.target.files[0], function(base64Str) {
                        imgPreview.src = base64Str; imgPreview.style.display = 'block';
                        base64Data.value = base64Str;
                        iconText.style.display = 'none'; spanText.style.display = 'none';
                    });
                }
            });

            pasteZone.addEventListener('paste', function(e) {
                e.preventDefault();
                let items = (e.clipboardData || e.originalEvent.clipboardData).items;
                for (let index in items) {
                    let item = items[index];
                    if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
                        let blob = item.getAsFile();
                        nenAnh(blob, function(base64Str) {
                            imgPreview.src = base64Str; imgPreview.style.display = 'block';
                            base64Data.value = base64Str;
                            iconText.style.display = 'none'; spanText.style.display = 'none';
                        });
                        break;
                    }
                }
            });

            let containerId = loaiFormHienTai === 'BA' ? "danh-sach-anh-ba" : "danh-sach-anh-dt";
            document.getElementById(containerId).appendChild(div);
        }

        function themDongDienBien() {
            let div = document.createElement("div"); div.className = "dynamic-row row-dienbien";
            div.innerHTML = `<div style="flex: 1;"><input type="text" class="db-thoigian" placeholder="Thời gian..."></div><div style="flex: 2;"><textarea class="db-dienbien" rows="3" placeholder="Diễn biến..."></textarea></div><div style="flex: 2;"><textarea class="db-xutri" rows="3" placeholder="Xử trí..."></textarea></div><button class="btn-delete-row" onclick="xoaDong(this)">Xóa</button>`;
            document.getElementById("danh-sach-dien-bien-ba").appendChild(div);
        }

        function themDongMucLyThuyet(savedTieuDe = "", savedNoiDung = "") {
            let div = document.createElement("div");
            div.className = "dynamic-row row-lythuyet";
            div.innerHTML = `
                <div class="form-group" style="margin-bottom: 8px; width: 100%;">
                    <label>Tiêu đề mục bổ sung:</label>
                    <input type="text" class="lt-title-input" placeholder="Ví dụ: IX. Tình huống minh họa" value="${escapeHtml(savedTieuDe)}">
                </div>
                <div class="form-group" style="margin-bottom: 8px; width: 100%;">
                    <label>Nội dung:</label>
                    <textarea class="lt-content-input" rows="5" placeholder="Copy nội dung mục bổ sung vào đây...">${escapeHtml(savedNoiDung)}</textarea>
                </div>
                <button class="btn-delete-row" onclick="xoaDong(this)" style="width: 160px; align-self: flex-end;">Xóa mục này</button>
            `;
            document.getElementById("danh-sach-muc-lt").appendChild(div);
        }

        function thuThapDuLieuLyThuyet() {
            let noiDungLyThuyet = {};
            mucLyThuyetCoSan.forEach(muc => { noiDungLyThuyet[muc.key] = layGiaTri(muc.id); });
            noiDungLyThuyet.mucBoSung = [];
            document.querySelectorAll("#danh-sach-muc-lt .row-lythuyet").forEach(row => {
                let tieuDe = row.querySelector('.lt-title-input')?.value.trim() || '';
                let noiDung = row.querySelector('.lt-content-input')?.value.trim() || '';
                if(tieuDe || noiDung) noiDungLyThuyet.mucBoSung.push({ tieuDe, noiDung });
            });
            return noiDungLyThuyet;
        }

        function napDuLieuLyThuyet(duLieu) {
            mucLyThuyetCoSan.forEach(muc => { ganGiaTri(muc.id, duLieu?.noiDungLyThuyet?.[muc.key] || duLieu?.[muc.key] || ''); });
            document.getElementById("danh-sach-muc-lt").innerHTML = "";
            let dsBoSung = duLieu?.noiDungLyThuyet?.mucBoSung || duLieu?.mucBoSung || [];
            dsBoSung.forEach(item => themDongMucLyThuyet(item.tieuDe || '', item.noiDung || ''));
        }

        function layDanhSachLyThuyetDeChieu() {
            let ds = mucLyThuyetCoSan.map(muc => ({ tieuDe: muc.tieuDe, noiDung: layGiaTri(muc.id) }));
            document.querySelectorAll("#danh-sach-muc-lt .row-lythuyet").forEach((row, idx) => {
                let tieuDe = row.querySelector('.lt-title-input')?.value.trim() || `MỤC BỔ SUNG ${idx + 1}`;
                let noiDung = row.querySelector('.lt-content-input')?.value.trim() || '';
                if(tieuDe || noiDung) ds.push({ tieuDe, noiDung });
            });
            return ds.filter(item => item.noiDung && item.noiDung.trim());
        }

        function dinhDangNoiDungLyThuyet(noiDung) {
            let dong = String(noiDung || '').split(/\n+/).map(x => x.trim()).filter(Boolean);
            if(dong.length === 0) return '<p><i>Chưa nhập nội dung.</i></p>';
            return dong.map(line => {
                let clean = escapeHtml(line).replace(/^[-•+*]\s*/, '');
                return `<p><span class="bullet-dot">•</span>${clean}</p>`;
            }).join('');
        }

        function capNhatTieuDeBenh() {
            const cfg = layCauHinhLoai();
            let val = document.getElementById(cfg.inputTen)?.value || '';
            document.getElementById(cfg.hienThi).innerText = val ? cfg.prefixHienThi + val.toUpperCase() : cfg.prefixHienThi + "..........................";
            trangThaiDaLuu = false; 
        }

        // ==========================================
        // LOGIC LƯU LÊN FIREBASE (BA & DT)
        // ==========================================
        function xuLyLuuHoSo() {
            const cfg = layCauHinhLoai();
            let tenBenh = layGiaTri(cfg.inputTen);
            let matKhau = layGiaTri(cfg.inputMatKhau);
            let nguoiTrinhBay = layGiaTri(cfg.inputNguoi);
            let khoa = document.getElementById(cfg.inputKhoa).value;
            
            if(!tenBenh) { alert(loaiFormHienTai === 'LT' ? "Vui lòng nhập Chủ đề / Tên bài lý thuyết!" : "Vui lòng nhập Tên bệnh/Chẩn đoán!"); return; }
            if(!matKhau) { alert("🔒 Vui lòng đặt MẬT KHẨU BẢO VỆ để tránh người khác xóa nhầm!"); return; }

            if(!maHoSoHienTai) {
                maHoSoHienTai = cfg.maPrefix + new Date().getTime().toString().slice(-6);
            }

            let arrAnh = [];
            if(loaiFormHienTai === 'BA' || loaiFormHienTai === 'DT') {
                let listAnhId = '#danh-sach-anh' + cfg.suffix + ' .row-anh';
                document.querySelectorAll(listAnhId).forEach(row => {
                    let b64 = row.querySelector('.base64-data').value;
                    let note = row.querySelector('.txt-ghichu').value;
                    if(b64 || note) arrAnh.push({ base64: b64, ghiChu: note });
                });
            }

            let duLieu = {
                id: maHoSoHienTai, khoa: khoa, matKhau: matKhau, tenBenh: tenBenh,
                nguoiTrinhBay: nguoiTrinhBay, danhSachAnh: arrAnh,
                loaiForm: loaiFormHienTai, ngayTao: new Date().toLocaleString('vi-VN')
            };

            if (loaiFormHienTai === 'BA') {
                let arrDienBien = [];
                document.querySelectorAll("#danh-sach-dien-bien-ba .row-dienbien").forEach(row => {
                    arrDienBien.push({
                        tg: row.querySelector('.db-thoigian').value,
                        db: row.querySelector('.db-dienbien').value,
                        xt: row.querySelector('.db-xutri').value
                    });
                });
                
                duLieu.tenBN = document.getElementById("in-ten-ba").value;
                duLieu.tuoi = document.getElementById("in-tuoi-ba").value;
                duLieu.nghe = document.getElementById("in-nghe-ba").value;
                duLieu.diaChi = document.getElementById("in-diachi-ba").value;
                duLieu.lyDo = document.getElementById("in-lydo-ba").value;
                duLieu.benhSu = document.getElementById("in-benhsu-ba").value;
                duLieu.tienSu = document.getElementById("in-tiensu-ba").value;
                duLieu.khamChung = document.getElementById("in-khamchung-ba").value;
                duLieu.clsText = document.getElementById("in-cls-text-ba").value;
                duLieu.tomtat = document.getElementById("in-tomtat-ba").value;
                duLieu.chandoan = document.getElementById("in-chandoan-ba").value;
                duLieu.banluan = document.getElementById("in-banluan-ba").value;
                duLieu.dienBienList = arrDienBien;
            }

            if (loaiFormHienTai === 'LT') {
                duLieu.noiDungLyThuyet = thuThapDuLieuLyThuyet();
            }

            db.ref(cfg.path + '/' + maHoSoHienTai).set(duLieu)
                .then(() => {
                    document.getElementById("modal-ma-ba").innerText = maHoSoHienTai;
                    document.getElementById("modal-luu").style.display = "flex";
                    trangThaiDaLuu = true; 
                })
                .catch((error) => { alert("❌ Lỗi khi lưu lên máy chủ: " + error.message); });
        }

        // ==========================================
        // TÌM KIẾM THEO CHUYÊN MỤC
        // ==========================================
        function moModalTimKiem() {
            const cfg = layCauHinhLoai();
            document.getElementById("danh-sach-kq").innerHTML = "<p style='text-align:center; color:#0284c7;'>⏳ Đang tải dữ liệu từ máy chủ...</p>";
            document.getElementById("title-modal-tim-kiem").innerText = cfg.titleTimKiem;
            document.getElementById("modal-tim-kiem").style.display = "flex";

            db.ref(cfg.path).get().then((snapshot) => {
                if (snapshot.exists()) {
                    let data = snapshot.val();
                    duLieuTamThoi = Object.values(data).filter(item => item && item.id);
                    let h = "";
                    duLieuTamThoi.reverse().forEach(ba => {
                        h += `
                        <div class="search-item">
                            <div class="search-item-info" onclick="taiDuLieu('${ba.id}')">
                                <strong>${escapeHtml(ba.id)}</strong> - ${escapeHtml(ba.tenBenh || '')} <br>
                                <span style="font-size: 14px; color: #64748b;">${escapeHtml(ba.khoa || '')} | Người trình bày: ${escapeHtml(ba.nguoiTrinhBay || '')} | Lưu lúc: ${escapeHtml(ba.ngayTao || '')}</span>
                            </div>
                            <button class="btn-delete-ba" onclick="xoaBenhAn('${ba.id}', event)">🗑️ Xóa</button>
                        </div>`;
                    });
                    document.getElementById("danh-sach-kq").innerHTML = h;
                } else {
                    document.getElementById("danh-sach-kq").innerHTML = "<p style='text-align:center;'>Chưa có dữ liệu nào trên hệ thống.</p>";
                }
            }).catch((error) => {
                document.getElementById("danh-sach-kq").innerHTML = "<p style='text-align:center; color:red;'>Lỗi kết nối máy chủ!</p>";
            });
        }

        function xoaBenhAn(id, event) {
            event.stopPropagation(); 
            const cfg = layCauHinhLoai();
            let ba = duLieuTamThoi.find(x => x.id === id);
            if(!ba) return;

            if(ba.matKhau) {
                let mkNhap = prompt(`🔒 Hồ sơ [${ba.tenBenh}] đang được bảo vệ.
Vui lòng NHẬP MẬT KHẨU để thực hiện quyền Xóa trên máy chủ:`);
                if(mkNhap === null) return; 
                if(mkNhap !== ba.matKhau) { alert("❌ MẬT KHẨU KHÔNG ĐÚNG! Bạn không có quyền xóa hồ sơ này."); return; }
            }

            let xacNhan = confirm(`⚠️ Bạn có chắc chắn XÓA VĨNH VIỄN hồ sơ [${id}] khỏi hệ thống trực tuyến không?`);
            if(xacNhan) {
                db.ref(cfg.path + '/' + id).remove()
                    .then(() => {
                        alert("Đã xóa hồ sơ thành công!");
                        if(maHoSoHienTai === id) maHoSoHienTai = "";
                        moModalTimKiem(); 
                    })
                    .catch((error) => { alert("Lỗi xóa dữ liệu: " + error.message); });
            }
        }

        // ==========================================
        // PHỤC HỒI LẠI DỮ LIỆU TỪ MÁY CHỦ
        // ==========================================
        function taiDuLieu(id) {
            let ba = duLieuTamThoi.find(x => x.id === id);
            if(ba) {
                const cfg = layCauHinhLoai();
                maHoSoHienTai = ba.id;
                let s = cfg.suffix;
                
                document.getElementById("in-khoa" + s).value = ba.khoa || "";
                document.getElementById("in-mat-khau" + s).value = ba.matKhau || "";
                document.getElementById("in-ten-benh" + s).value = ba.tenBenh || "";
                document.getElementById("in-nguoi-trinh-bay" + s).value = ba.nguoiTrinhBay || "";

                if(loaiFormHienTai === 'BA') {
                    document.getElementById("in-ten-ba").value = ba.tenBN || "";
                    document.getElementById("in-tuoi-ba").value = ba.tuoi || "";
                    document.getElementById("in-nghe-ba").value = ba.nghe || "";
                    document.getElementById("in-diachi-ba").value = ba.diaChi || "";
                    document.getElementById("in-lydo-ba").value = ba.lyDo || "";
                    document.getElementById("in-benhsu-ba").value = ba.benhSu || "";
                    document.getElementById("in-tiensu-ba").value = ba.tienSu || "";
                    document.getElementById("in-khamchung-ba").value = ba.khamChung || "";
                    document.getElementById("in-cls-text-ba").value = ba.clsText || "";
                    document.getElementById("in-tomtat-ba").value = ba.tomtat || "";
                    document.getElementById("in-chandoan-ba").value = ba.chandoan || "";
                    document.getElementById("in-banluan-ba").value = ba.banluan || "";

                    document.getElementById("danh-sach-dien-bien-ba").innerHTML = "";
                    if(ba.dienBienList && ba.dienBienList.length > 0) {
                        ba.dienBienList.forEach(item => {
                            let div = document.createElement("div"); div.className = "dynamic-row row-dienbien";
                            div.innerHTML = `<div style="flex:1;"><input type="text" class="db-thoigian" value="${escapeHtml(item.tg || '')}"></div><div style="flex:2;"><textarea class="db-dienbien" rows="3">${escapeHtml(item.db || '')}</textarea></div><div style="flex:2;"><textarea class="db-xutri" rows="3">${escapeHtml(item.xt || '')}</textarea></div><button class="btn-delete-row" onclick="xoaDong(this)">Xóa</button>`;
                            document.getElementById("danh-sach-dien-bien-ba").appendChild(div);
                        });
                    }
                }

                if(loaiFormHienTai === 'LT') {
                    napDuLieuLyThuyet(ba);
                }

                if(loaiFormHienTai === 'BA' || loaiFormHienTai === 'DT') {
                    document.getElementById("danh-sach-anh" + s).innerHTML = "";
                    if(ba.danhSachAnh && ba.danhSachAnh.length > 0) {
                        ba.danhSachAnh.forEach(anh => { themDongAnh(anh.base64, anh.ghiChu); });
                    }
                }

                capNhatTieuDeBenh(); trangThaiDaLuu = true; 
                document.getElementById("modal-tim-kiem").style.display = "none";
            }
        }

        // ==========================================
        // CẬP NHẬT TRÌNH CHIẾU THÔNG MINH CHO CẢ 2 LOẠI
        // ==========================================
        function batDauTrinhChieu() {
            if(!trangThaiDaLuu) { alert("⛔ BẠN CHƯA LƯU DỮ LIỆU LÊN HỆ THỐNG!"); return; }

            const cfg = layCauHinhLoai();
            let s = cfg.suffix;
            document.getElementById("out-khoa-welcome").innerText = document.getElementById(cfg.inputKhoa).value.toUpperCase();
            document.getElementById("out-welcome-title").innerText = loaiFormHienTai === 'BA' ? "✨ CHÀO MỪNG ĐẾN VỚI BUỔI BÌNH BỆNH ÁN ✨" : (loaiFormHienTai === 'DT' ? "✨ CHÀO MỪNG ĐẾN VỚI BUỔI BÌNH ĐƠN THUỐC ✨" : "✨ CHÀO MỪNG ĐẾN VỚI PHẦN LÝ THUYẾT ✨");
            document.getElementById("out-nguoi-trinh-bay").innerText = document.getElementById(cfg.inputNguoi).value;

            document.querySelectorAll('.slide-anh-dong, .slide-lt-dong').forEach(e => e.remove());
            document.querySelectorAll('.slide').forEach(e => {
                e.classList.remove('slide-active-target');
                e.style.display = 'none';
            });
            document.querySelector('.slide-welcome').classList.add('slide-active-target');

            if(loaiFormHienTai === 'BA') {
                document.getElementById("out-ten-benh-ba").innerText = document.getElementById("in-ten-benh-ba").value;
                document.getElementById("out-ten-ba").innerText = document.getElementById("in-ten-ba").value;
                document.getElementById("out-tuoi-ba").innerText = document.getElementById("in-tuoi-ba").value;
                document.getElementById("out-nghe-ba").innerText = document.getElementById("in-nghe-ba").value;
                document.getElementById("out-diachi-ba").innerText = document.getElementById("in-diachi-ba").value;
                document.getElementById("out-lydo-ba").innerText = document.getElementById("in-lydo-ba").value;
                document.getElementById("out-benhsu-ba").innerText = document.getElementById("in-benhsu-ba").value;
                document.getElementById("out-tiensu-ba").innerText = document.getElementById("in-tiensu-ba").value;
                document.getElementById("out-khamchung-ba").innerText = document.getElementById("in-khamchung-ba").value;
                document.getElementById("out-cls-text-ba").innerText = document.getElementById("in-cls-text-ba").value;
                document.getElementById("out-tomtat-ba").innerText = document.getElementById("in-tomtat-ba").value;
                document.getElementById("out-chandoan-ba").innerText = document.getElementById("in-chandoan-ba").value;
                document.getElementById("out-banluan-ba").innerText = document.getElementById("in-banluan-ba").value;

                let htmlBang = `<table class="tb-dienbien"><tr><th>THỜI GIAN</th><th>DIỄN BIẾN</th><th>XỬ TRÍ</th></tr>`;
                document.querySelectorAll("#danh-sach-dien-bien-ba .row-dienbien").forEach(row => {
                    let tg = escapeHtml(row.querySelector('.db-thoigian').value);
                    let db = escapeHtml(row.querySelector('.db-dienbien').value).replace(/\n/g, "<br>");
                    let xt = escapeHtml(row.querySelector('.db-xutri').value).replace(/\n/g, "<br>");
                    if(tg || db || xt) htmlBang += `<tr><td>${tg}</td><td>${db}</td><td>${xt}</td></tr>`;
                });
                htmlBang += `</table>`;
                document.getElementById("out-bang-dienbien-ba").innerHTML = htmlBang;

                document.querySelectorAll('.slide-ba').forEach(e => e.classList.add('slide-active-target'));
            } else if(loaiFormHienTai === 'DT') {
                document.getElementById("out-ten-benh-dt").innerText = document.getElementById("in-ten-benh-dt").value;
                document.getElementById("out-khoa-dt-slide").innerText = document.getElementById("in-khoa-dt").value;
                document.getElementById("out-nguoi-tb-dt-slide").innerText = document.getElementById("in-nguoi-trinh-bay-dt").value;

                document.querySelectorAll('.slide-dt').forEach(e => e.classList.add('slide-active-target'));
            } else if(loaiFormHienTai === 'LT') {
                let dsLyThuyet = layDanhSachLyThuyetDeChieu();
                if(dsLyThuyet.length === 0) { alert("⚠️ Chưa có nội dung lý thuyết để trình chiếu. Vui lòng nhập ít nhất 1 mục nội dung."); return; }
                document.getElementById("out-chu-de-lt").innerText = document.getElementById("in-ten-benh-lt").value;
                document.getElementById("out-khoa-lt-slide").innerText = document.getElementById("in-khoa-lt").value;
                document.getElementById("out-nguoi-tb-lt-slide").innerText = document.getElementById("in-nguoi-trinh-bay-lt").value;

                const container = document.getElementById("slide-container");
                dsLyThuyet.forEach(item => {
                    let newSlide = document.createElement('div');
                    newSlide.className = 'slide slide-lt-dong slide-active-target';
                    newSlide.innerHTML = `
                        <div class="slide-header">${escapeHtml(item.tieuDe)}</div>
                        <div class="slide-content slide-theory-content">${dinhDangNoiDungLyThuyet(item.noiDung)}</div>
                    `;
                    container.appendChild(newSlide);
                });
                document.querySelectorAll('.slide-lt').forEach(e => e.classList.add('slide-active-target'));
            }

            if(loaiFormHienTai === 'BA' || loaiFormHienTai === 'DT') {
                let container = document.getElementById("slide-container");
                let anhRows = document.querySelectorAll('#danh-sach-anh' + s + ' .row-anh');

                for(let row of anhRows) {
                    let base64 = row.querySelector('.base64-data').value;
                    let ghiChu = row.querySelector('.txt-ghichu').value;
                    
                    if (base64) {
                        let newSlide = document.createElement('div');
                        newSlide.className = 'slide slide-anh-dong slide-active-target'; 
                        let titleStr = loaiFormHienTai === 'BA' ? '📸 IV. HÌNH ẢNH CẬN LÂM SÀNG' : '📸 II. HÌNH ẢNH ĐƠN THUỐC';
                        newSlide.innerHTML = `
                            <div class="slide-header">${titleStr}</div>
                            <div class="slide-content image-slide-content" style="display: flex; flex-direction: column;">
                                <div class="slide-image-container">
                                    <img src="${base64}">
                                    ${ghiChu ? `<div class="slide-image-note">${escapeHtml(ghiChu)}</div>` : ''}
                                </div>
                            </div>
                        `;
                        
                        if(loaiFormHienTai === 'BA') {
                            container.insertBefore(newSlide, document.getElementById('slide-tomtat-ba'));
                        } else {
                            container.appendChild(newSlide);
                        }
                    }
                }
            }

            document.querySelector(".khu-vuc-nhap[style*='display: block']").style.display = "none";
            document.getElementById("khu-vuc-trinh-chieu").style.display = "block";
            let elem = document.documentElement; if (elem.requestFullscreen) elem.requestFullscreen();

            danhSachSlide = document.querySelectorAll(".slide-active-target"); 
            slideHienTai = 0;
            datLaiThuPhongAnh(false);
            hienThiSlide(slideHienTai);
        }

        function ketThucTrinhChieu() {
            document.getElementById("khu-vuc-trinh-chieu").style.display = "none";
            document.getElementById(layCauHinhLoai().formId).style.display = "block";
            if (document.exitFullscreen) document.exitFullscreen();
        }

        function hienThiSlide(n) {
            for (let i = 0; i < danhSachSlide.length; i++) {
                danhSachSlide[i].classList.remove("active");
                danhSachSlide[i].style.display = 'none';
            }
            if(danhSachSlide[n]) {
                danhSachSlide[n].classList.add("active"); 
                danhSachSlide[n].style.display = 'block';
            }
            capNhatHienThiNutThuPhong();
        }

        let mucThuPhongAnh = 1;
        let viTriAnhX = 0;
        let viTriAnhY = 0;

        const mucThuPhongAnhMin = 0.7;
        const mucThuPhongAnhMax = 2.8;

        function dangChieuSlideHinhAnh() {
            const slideDangChieu = danhSachSlide && danhSachSlide[slideHienTai];
            return !!(slideDangChieu && slideDangChieu.querySelector('.slide-image-container img'));
        }

        function capNhatThuPhongAnh() {
            const khuTrinhChieu = document.getElementById("khu-vuc-trinh-chieu");

            if(khuTrinhChieu) {
                khuTrinhChieu.style.setProperty('--image-zoom', mucThuPhongAnh);
                khuTrinhChieu.style.setProperty('--image-pan-x', viTriAnhX + "px");
                khuTrinhChieu.style.setProperty('--image-pan-y', viTriAnhY + "px");
            }

            const zoomPercent = document.getElementById("zoom-percent");
            if(zoomPercent) zoomPercent.innerText = Math.round(mucThuPhongAnh * 100) + "%";
        }

        function thuPhongAnh(buoc) {
            if(!dangChieuSlideHinhAnh()) return;
            mucThuPhongAnh = Math.min(mucThuPhongAnhMax, Math.max(mucThuPhongAnhMin, +(mucThuPhongAnh + buoc).toFixed(2)));
            capNhatThuPhongAnh();
        }

        function diChuyenAnh(x, y) {
            if(!dangChieuSlideHinhAnh()) return;
            viTriAnhX += x;
            viTriAnhY += y;
            capNhatThuPhongAnh();
        }

        function datLaiThuPhongAnh(thongBao = true) {
            mucThuPhongAnh = 1;
            viTriAnhX = 0;
            viTriAnhY = 0;
            capNhatThuPhongAnh();
            if(thongBao) capNhatHienThiNutThuPhong();
        }

        function capNhatHienThiNutThuPhong() {
            const zoomControls = document.getElementById("zoom-controls");
            const coHinhAnh = dangChieuSlideHinhAnh();
            if(zoomControls) zoomControls.classList.toggle('show', coHinhAnh);
        }

        let dangKeoAnh = false;
        let diemBatDauX = 0;
        let diemBatDauY = 0;
        let viTriBatDauX = 0;
        let viTriBatDauY = 0;
        let boQuaClickTrinhChieu = false;
        let khungAnhDangKeo = null;

        const khuTrinhChieuKeoAnh = document.getElementById("khu-vuc-trinh-chieu");

        khuTrinhChieuKeoAnh.addEventListener("pointerdown", function(e) {
            const khungAnh = e.target.closest('.slide-image-container');
            if(!khungAnh || !dangChieuSlideHinhAnh()) return;
            if(e.pointerType === "mouse" && e.button !== 0) return;

            e.preventDefault();
            e.stopPropagation();

            dangKeoAnh = true;
            boQuaClickTrinhChieu = true;
            khungAnhDangKeo = khungAnh;

            diemBatDauX = e.clientX;
            diemBatDauY = e.clientY;
            viTriBatDauX = viTriAnhX;
            viTriBatDauY = viTriAnhY;

            khungAnh.classList.add("dragging");
            khungAnh.setPointerCapture?.(e.pointerId);
        });

        khuTrinhChieuKeoAnh.addEventListener("pointermove", function(e) {
            if(!dangKeoAnh) return;

            e.preventDefault();

            viTriAnhX = viTriBatDauX + (e.clientX - diemBatDauX);
            viTriAnhY = viTriBatDauY + (e.clientY - diemBatDauY);

            capNhatThuPhongAnh();
        });

        function ketThucKeoAnh() {
            if(!dangKeoAnh) return;

            dangKeoAnh = false;

            if(khungAnhDangKeo) {
                khungAnhDangKeo.classList.remove("dragging");
                khungAnhDangKeo = null;
            }
        }

        khuTrinhChieuKeoAnh.addEventListener("pointerup", ketThucKeoAnh);
        khuTrinhChieuKeoAnh.addEventListener("pointercancel", ketThucKeoAnh);
        khuTrinhChieuKeoAnh.addEventListener("pointerleave", ketThucKeoAnh);

        function chuyenSlide(buoc) {
            if (slideHienTai + buoc >= 0 && slideHienTai + buoc < danhSachSlide.length) {
                slideHienTai += buoc;
                datLaiThuPhongAnh(false);
                hienThiSlide(slideHienTai);
            }
        }

        document.addEventListener('keydown', function(event) {
            if (document.getElementById("khu-vuc-trinh-chieu").style.display === "block") {
                if ((event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") && dangChieuSlideHinhAnh() && event.shiftKey) {
                    event.preventDefault();
                    if(event.key === "ArrowUp") diChuyenAnh(0, -40);
                    if(event.key === "ArrowDown") diChuyenAnh(0, 40);
                    if(event.key === "ArrowLeft") diChuyenAnh(-40, 0);
                    if(event.key === "ArrowRight") diChuyenAnh(40, 0);
                } else if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " " || event.key === "Enter") {
                    event.preventDefault(); chuyenSlide(1);
                } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
                    event.preventDefault(); chuyenSlide(-1);
                } else if (event.key === "+" || event.key === "=") {
                    event.preventDefault(); thuPhongAnh(0.1);
                } else if (event.key === "-" || event.key === "_") {
                    event.preventDefault(); thuPhongAnh(-0.1);
                } else if (event.key === "0") {
                    event.preventDefault(); datLaiThuPhongAnh();
                } else if (event.key === "Escape") { ketThucTrinhChieu(); }
            }
        });

        document.getElementById("khu-vuc-trinh-chieu").addEventListener("click", function(e) {
            if(boQuaClickTrinhChieu) {
                boQuaClickTrinhChieu = false;
                return;
            }

            if(e.target.closest('.slide-controls')) return;
            if(e.target.closest('.slide-image-container')) return;

            let clickX = e.clientX;
            let screenWidth = window.innerWidth;

            if(clickX > screenWidth / 2) chuyenSlide(1);
            else chuyenSlide(-1);
        });

        // ==========================================
        // IMPORT/EXPORT SAO LƯU (.JSON VÀ XML BHYT)
        // ==========================================
        function docFileXMLHoso(event) {
            let file = event.target.files[0];
            if (!file) return;
            let reader = new FileReader();
            reader.onload = function(e) {
                let text = e.target.result;
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(text, "text/xml");
                let filesHoso = xmlDoc.getElementsByTagName("FILEHOSO");
                let base64Data = "";
                for (let i = 0; i < filesHoso.length; i++) {
                    let loai = filesHoso[i].getElementsByTagName("LOAIHOSO")[0]?.textContent;
                    if (loai === "XML1") {
                        base64Data = filesHoso[i].getElementsByTagName("NOIDUNGFILE")[0]?.textContent;
                        break;
                    }
                }
                if (!base64Data) { alert("❌ Không tìm thấy dữ liệu XML1 trong file này!"); return; }
                try {
                    let decodedStr = decodeURIComponent(escape(window.atob(base64Data)));
                    let xmlDacTa = parser.parseFromString(decodedStr, "text/xml");
                    let hoTen = xmlDacTa.getElementsByTagName("HO_TEN")[0]?.textContent || "";
                    let ngaySinhStr = xmlDacTa.getElementsByTagName("NGAY_SINH")[0]?.textContent || ""; 
                    let diaChi = xmlDacTa.getElementsByTagName("DIA_CHI")[0]?.textContent || "";
                    let tenBenh = xmlDacTa.getElementsByTagName("TEN_BENH")[0]?.textContent || "";
                    let lyDoVaoVien = xmlDacTa.getElementsByTagName("LY_DO_VV")[0]?.textContent || "";
                    let tuoi = "";
                    if (ngaySinhStr.length >= 4) {
                        let namSinh = parseInt(ngaySinhStr.substring(0, 4));
                        let namHienTai = new Date().getFullYear();
                        tuoi = (namHienTai - namSinh).toString();
                    }
                    let tenBenhChuan = tenBenh.split(';')[0]; 
                    document.getElementById("in-ten-ba").value = hoTen;
                    document.getElementById("in-tuoi-ba").value = tuoi;
                    document.getElementById("in-diachi-ba").value = diaChi;
                    document.getElementById("in-ten-benh-ba").value = tenBenhChuan;
                    document.getElementById("in-chandoan-ba").value = tenBenh;
                    document.getElementById("in-lydo-ba").value = lyDoVaoVien; 
                    capNhatTieuDeBenh();
                    alert("✅ Đã tải thành công hồ sơ bệnh nhân: " + hoTen);
                } catch (error) {
                    alert("❌ Có lỗi xảy ra khi giải mã file XML này!");
                }
                event.target.value = ''; 
            };
            reader.readAsText(file);
        }

        function xuatFileDuLieu() {
            const cfg = layCauHinhLoai();
            let s = cfg.suffix;
            let tenBenh = document.getElementById("in-ten-benh" + s).value.trim();
            if(!tenBenh) { alert(loaiFormHienTai === 'LT' ? "⚠️ Vui lòng nhập Chủ đề lý thuyết trước khi xuất file!" : "⚠️ Vui lòng nhập Tên bệnh/Thông tin đơn thuốc trước khi xuất file!"); return; }

            let arrAnh = [];
            if(loaiFormHienTai === 'BA' || loaiFormHienTai === 'DT') {
                document.querySelectorAll("#danh-sach-anh" + s + " .row-anh").forEach(row => {
                    let b64 = row.querySelector('.base64-data').value;
                    let note = row.querySelector('.txt-ghichu').value;
                    if(b64 || note) arrAnh.push({ base64: b64, ghiChu: note });
                });
            }

            let duLieu = {
                khoa: document.getElementById("in-khoa" + s).value, matKhau: document.getElementById("in-mat-khau" + s).value, 
                tenBenh: tenBenh, nguoiTrinhBay: document.getElementById("in-nguoi-trinh-bay" + s).value,
                loaiForm: loaiFormHienTai, danhSachAnh: arrAnh
            };

            if(loaiFormHienTai === 'BA') {
                let arrDienBien = [];
                document.querySelectorAll("#danh-sach-dien-bien-ba .row-dienbien").forEach(row => {
                    arrDienBien.push({ tg: row.querySelector('.db-thoigian').value, db: row.querySelector('.db-dienbien').value, xt: row.querySelector('.db-xutri').value });
                });
                
                duLieu.tenBN = document.getElementById("in-ten-ba").value;
                duLieu.tuoi = document.getElementById("in-tuoi-ba").value;
                duLieu.nghe = document.getElementById("in-nghe-ba").value;
                duLieu.diaChi = document.getElementById("in-diachi-ba").value;
                duLieu.lyDo = document.getElementById("in-lydo-ba").value;
                duLieu.benhSu = document.getElementById("in-benhsu-ba").value;
                duLieu.tienSu = document.getElementById("in-tiensu-ba").value;
                duLieu.khamChung = document.getElementById("in-khamchung-ba").value;
                duLieu.clsText = document.getElementById("in-cls-text-ba").value;
                duLieu.tomtat = document.getElementById("in-tomtat-ba").value;
                duLieu.chandoan = document.getElementById("in-chandoan-ba").value;
                duLieu.banluan = document.getElementById("in-banluan-ba").value;
                duLieu.dienBienList = arrDienBien;
            }

            if(loaiFormHienTai === 'LT') {
                duLieu.noiDungLyThuyet = thuThapDuLieuLyThuyet();
            }

            let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(duLieu, null, 2));
            let dlNode = document.createElement('a'); dlNode.setAttribute("href", dataStr);
            let tenFile = loaiFormHienTai === 'BA' ? 'Backup_HSBA_' : (loaiFormHienTai === 'DT' ? 'Backup_DonThuoc_' : 'Backup_LyThuyet_');
            dlNode.setAttribute("download", tenFile + tenBenh.replace(/\s/g, "_") + ".json");
            document.body.appendChild(dlNode); dlNode.click(); dlNode.remove();
        }

        function nhapFileDuLieu(event) {
            let file = event.target.files[0];
            if (!file) return;
            let reader = new FileReader();
            reader.onload = function(e) {
                try {
                    let ba = JSON.parse(e.target.result);
                    const cfg = layCauHinhLoai();
                    let s = cfg.suffix;
                    
                    if(ba.loaiForm && ba.loaiForm !== loaiFormHienTai) {
                        const tenLoai = { BA: 'Bệnh án', DT: 'Đơn thuốc', LT: 'Lý thuyết' };
                        alert(`❌ File này là của ${tenLoai[ba.loaiForm] || ba.loaiForm}, bạn đang ở mục khác!`); return;
                    }

                    document.getElementById("in-khoa" + s).value = ba.khoa || "";
                    document.getElementById("in-mat-khau" + s).value = ba.matKhau || "";
                    document.getElementById("in-ten-benh" + s).value = ba.tenBenh || "";
                    document.getElementById("in-nguoi-trinh-bay" + s).value = ba.nguoiTrinhBay || "";

                    if(loaiFormHienTai === 'BA') {
                        document.getElementById("in-ten-ba").value = ba.tenBN || "";
                        document.getElementById("in-tuoi-ba").value = ba.tuoi || "";
                        document.getElementById("in-nghe-ba").value = ba.nghe || "";
                        document.getElementById("in-diachi-ba").value = ba.diaChi || "";
                        document.getElementById("in-lydo-ba").value = ba.lyDo || "";
                        document.getElementById("in-benhsu-ba").value = ba.benhSu || "";
                        document.getElementById("in-tiensu-ba").value = ba.tienSu || "";
                        document.getElementById("in-khamchung-ba").value = ba.khamChung || "";
                        document.getElementById("in-cls-text-ba").value = ba.clsText || "";
                        document.getElementById("in-tomtat-ba").value = ba.tomtat || "";
                        document.getElementById("in-chandoan-ba").value = ba.chandoan || "";
                        document.getElementById("in-banluan-ba").value = ba.banluan || "";

                        document.getElementById("danh-sach-dien-bien-ba").innerHTML = "";
                        if(ba.dienBienList && ba.dienBienList.length > 0) {
                            ba.dienBienList.forEach(item => {
                                let div = document.createElement("div"); div.className = "dynamic-row row-dienbien";
                                div.innerHTML = `<div style="flex:1;"><input type="text" class="db-thoigian" value="${escapeHtml(item.tg || '')}"></div><div style="flex:2;"><textarea class="db-dienbien" rows="3">${escapeHtml(item.db || '')}</textarea></div><div style="flex:2;"><textarea class="db-xutri" rows="3">${escapeHtml(item.xt || '')}</textarea></div><button class="btn-delete-row" onclick="xoaDong(this)">Xóa</button>`;
                                document.getElementById("danh-sach-dien-bien-ba").appendChild(div);
                            });
                        } else { themDongDienBien(); }
                    }

                    if(loaiFormHienTai === 'LT') {
                        napDuLieuLyThuyet(ba);
                    }

                    if(loaiFormHienTai === 'BA' || loaiFormHienTai === 'DT') {
                        document.getElementById("danh-sach-anh" + s).innerHTML = "";
                        if(ba.danhSachAnh && ba.danhSachAnh.length > 0) {
                            ba.danhSachAnh.forEach(anh => { themDongAnh(anh.base64, anh.ghiChu); });
                        }
                    }

                    capNhatTieuDeBenh();
                    alert("✅ Đã khôi phục dữ liệu từ file sao lưu thành công!");
                } catch (error) {
                    alert("❌ File không đúng định dạng sao lưu (.json)!");
                }
                event.target.value = ''; 
            };
            reader.readAsText(file);
        }

        // ==========================================
        // MODULE: XUẤT FILE PDF AN TOÀN - CHỮ SẮC NÉT
        // ==========================================
        function getTodayStr() {
            let d = new Date(); let m = '' + (d.getMonth() + 1), day = '' + d.getDate(), y = d.getFullYear();
            if (m.length < 2) m = '0' + m; if (day.length < 2) day = '0' + day; return [y, m, day].join('-');
        }

        function removeAccents(str) {
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/\s+/g, '_');
        }

        function xuatPDFBenhAn() {
            let tenBenh = document.getElementById("in-ten-benh-ba").value.trim();
            if(!tenBenh) { alert("Vui lòng nhập Tên bệnh / Chẩn đoán để kết xuất PDF!"); return; }

            // Đổ dữ liệu từ Form nhập liệu sang File mẫu A4 ẩn
            document.getElementById("pdf-ba-khoa").innerText = document.getElementById("in-khoa-ba").value;
            document.getElementById("pdf-ba-ma").innerText = maHoSoHienTai || 'BA-' + new Date().getTime().toString().slice(-6);
            document.getElementById("pdf-ba-ten").innerText = document.getElementById("in-ten-ba").value || "..................";
            document.getElementById("pdf-ba-tuoi").innerText = document.getElementById("in-tuoi-ba").value || "...";
            document.getElementById("pdf-ba-nghe").innerText = document.getElementById("in-nghe-ba").value || "...";
            document.getElementById("pdf-ba-diachi").innerText = document.getElementById("in-diachi-ba").value || "...";
            document.getElementById("pdf-ba-lydo").innerText = document.getElementById("in-lydo-ba").value;
            document.getElementById("pdf-ba-benhsu").innerText = document.getElementById("in-benhsu-ba").value;
            document.getElementById("pdf-ba-tiensu").innerText = document.getElementById("in-tiensu-ba").value;
            document.getElementById("pdf-ba-kham").innerText = document.getElementById("in-khamchung-ba").value;
            document.getElementById("pdf-ba-cls").innerText = document.getElementById("in-cls-text-ba").value;
            document.getElementById("pdf-ba-tomtat").innerText = document.getElementById("in-tomtat-ba").value;
            document.getElementById("pdf-ba-chandoan").innerText = document.getElementById("in-chandoan-ba").value || tenBenh;
            document.getElementById("pdf-ba-banluan").innerText = document.getElementById("in-banluan-ba").value;
            document.getElementById("pdf-ba-bacsiky").innerText = document.getElementById("in-nguoi-trinh-bay-ba").value;

            // Xử lý nạp bảng diễn biến xử trí vào mẫu in
            let tbodyDienBien = document.getElementById("pdf-ba-dienbien-tbody");
            tbodyDienBien.innerHTML = ''; let hasDienBien = false;
            document.querySelectorAll("#danh-sach-dien-bien-ba .row-dienbien").forEach(row => {
                let tg = row.querySelector('.db-thoigian').value;
                let db = row.querySelector('.db-dienbien').value;
                let xt = row.querySelector('.db-xutri').value;
                if(tg || db || xt) {
                    hasDienBien = true;
                    tbodyDienBien.innerHTML += `<tr class="avoid-break"><td>${tg}</td><td>${db.replace(/\n/g, '<br>')}</td><td>${xt.replace(/\n/g, '<br>')}</td></tr>`;
                }
            });
            document.getElementById('pdf-ba-dienbien-container').style.display = hasDienBien ? 'block' : 'none';

            // Xử lý nạp ảnh cận lâm sàng đã dán
            let imgContainer = document.getElementById("pdf-ba-images"); imgContainer.innerHTML = "";
            document.querySelectorAll('#danh-sach-anh-ba .row-anh').forEach(row => {
                let b64 = row.querySelector('.base64-data').value; let ghiChu = row.querySelector('.txt-ghichu').value;
                if (b64) {
                    imgContainer.innerHTML += `<div style="page-break-inside:avoid; margin-top:15px; text-align:center;"><img src="${b64}" style="max-width:95%; max-height:480px; border:1px solid #333; padding:2px;"><br><i style="color:#dc2626; font-size:14px; font-weight:bold; margin-top:5px; display:block;">Hình ảnh đính kèm: ${ghiChu}</i></div>`;
                }
            });

            thucHienExportPDF('pdf-template-ba', `BenhAn_${removeAccents(document.getElementById("in-ten-ba").value || "BenhNhan")}_${getTodayStr()}.pdf`);
        }

        function xuatPDFDonThuoc() {
            let tenBenh = document.getElementById("in-ten-benh-dt").value.trim();
            if(!tenBenh) { alert("Vui lòng nhập thông tin Đơn thuốc để kết xuất PDF!"); return; }

            document.getElementById("pdf-dt-khoa").innerText = document.getElementById("in-khoa-dt").value;
            document.getElementById("pdf-dt-ma").innerText = maHoSoHienTai || 'DT-' + new Date().getTime().toString().slice(-6);
            document.getElementById("pdf-dt-chandoan").innerText = tenBenh;
            document.getElementById("pdf-dt-bacsiky").innerText = document.getElementById("in-nguoi-trinh-bay-dt").value;

            // Xử lý nạp ảnh đơn thuốc đã dán vào mẫu in
            let imgContainer = document.getElementById("pdf-dt-images"); imgContainer.innerHTML = ""; let hasImage = false;
            document.querySelectorAll('#danh-sach-anh-dt .row-anh').forEach(row => {
                let b64 = row.querySelector('.base64-data').value; let ghiChu = row.querySelector('.txt-ghichu').value;
                if (b64) {
                    hasImage = true;
                    imgContainer.innerHTML += `<div style="page-break-inside:avoid; margin-top:15px; text-align:center;"><img src="${b64}" style="max-width:95%; border:1px dashed #0284c7; padding:4px;"><br><i style="color:#dc2626; font-size:14px; font-weight:bold; margin-top:5px; display:block;">Ghi chú đơn thuốc: ${ghiChu}</i></div>`;
                }
            });
            
            if(!hasImage) { 
                if(!confirm("Đơn thuốc chưa có hình ảnh nào. Vẫn tiếp tục xuất PDF rỗng?")) return; 
            }

            thucHienExportPDF('pdf-template-dt', `DonThuoc_${removeAccents(tenBenh.substring(0,20))}_${getTodayStr()}.pdf`);
        }

        function xuatPDFLyThuyet() {
            let tenBenh = document.getElementById("in-ten-benh-lt").value.trim();
            if(!tenBenh) { alert("Vui lòng nhập Chủ đề / Tên bài lý thuyết để kết xuất PDF!"); return; }
            let dsLyThuyet = layDanhSachLyThuyetDeChieu();
            if(dsLyThuyet.length === 0) { alert("⚠️ Chưa có nội dung lý thuyết để xuất PDF. Vui lòng nhập ít nhất 1 mục nội dung."); return; }

            document.getElementById("pdf-lt-khoa").innerText = document.getElementById("in-khoa-lt").value;
            document.getElementById("pdf-lt-ma").innerText = maHoSoHienTai || 'LT-' + new Date().getTime().toString().slice(-6);
            document.getElementById("pdf-lt-chude").innerText = tenBenh;
            document.getElementById("pdf-lt-nguoitb").innerText = document.getElementById("in-nguoi-trinh-bay-lt").value;
            document.getElementById("pdf-lt-bacsiky").innerText = document.getElementById("in-nguoi-trinh-bay-lt").value;

            let html = '';
            dsLyThuyet.forEach(item => {
                html += `<div class="pdf-section avoid-break" style="margin-top: 16px;">
                    <strong style="color:#0284c7; font-size:16px;">${escapeHtml(item.tieuDe)}</strong><br>
                    <span class="pdf-text-block">${escapeHtml(item.noiDung).replace(/\n/g, '<br>')}</span>
                </div>`;
            });
            document.getElementById("pdf-lt-content").innerHTML = html;

            thucHienExportPDF('pdf-template-lt', `LyThuyet_${removeAccents(tenBenh.substring(0,30))}_${getTodayStr()}.pdf`);
        }

        // HÀM LÀM MỊN GIAO DIỆN VÀ XOÁ LỖI TRẮNG FILE TRÊN CLIENT
        function thucHienExportPDF(templateId, fileName) {
            // Bước 1: Hiện màng bảo vệ Loader
            document.getElementById("pdf-loader").style.display = "flex"; 
            
            let container = document.getElementById("pdf-export-container");
            let template = document.getElementById(templateId);

            // QUAN TRỌNG NHẤT: Ép trình duyệt cuộn lên đỉnh trang để chống lỗi lệch tọa độ chụp của thẻ Canvas
            window.scrollTo(0, 0);

            // Kéo khung in ra để trình duyệt render
            container.style.display = "block"; 
            document.getElementById('pdf-template-ba').style.display = (templateId === 'pdf-template-ba') ? 'block' : 'none';
            document.getElementById('pdf-template-dt').style.display = (templateId === 'pdf-template-dt') ? 'block' : 'none';
            document.getElementById('pdf-template-lt').style.display = (templateId === 'pdf-template-lt') ? 'block' : 'none';

            let opt = {
                margin:       [15, 15, 15, 15], // Căn lề trên, trái, dưới, phải (mm)
                filename:     fileName,
                image:        { type: 'jpeg', quality: 1 },
                html2canvas:  { 
                    scale: 2, 
                    useCORS: true, 
                    letterRendering: true, 
                    scrollY: 0, // Bắt buộc chụp từ tọa độ Y=0
                    windowY: 0,
                    backgroundColor: '#ffffff' // Phủ nền trắng tinh để không bị lỗi xuyên thấu
                }, 
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Bước 3: Đợi 800ms để DOM vẽ xong dữ liệu rồi mới "Chụp" thành PDF
            setTimeout(() => {
                // Nhắm thẳng vào ID của Template con thay vì Container mẹ
                html2pdf().set(opt).from(template).save().then(() => {
                    // Trả lại hiện trạng cũ sau khi xuất thành công
                    container.style.display = "none";
                    document.getElementById("pdf-loader").style.display = "none";
                }).catch(err => {
                    console.error("Lỗi xuất PDF:", err);
                    alert("❌ Đã có lỗi xảy ra trong quá trình kết xuất PDF!");
                    container.style.display = "none";
                    document.getElementById("pdf-loader").style.display = "none";
                });
            }, 800); 
        }
