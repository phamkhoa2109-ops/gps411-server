# 🎓 TÀI LIỆU GIẢI THÍCH CHI TIẾT & BẢN CHẤT KỸ THUẬT POSTER A0
**Đồ án: GPS411 — IoT Motorcycle Anti-Theft & Real-Time Cellular Tracking System**  
*(Hệ thống Giám sát & Chống trộm Xe máy thông minh IoT thời gian thực qua mạng di động 4G)*  
**Học phần:** MIP201 — IoT Systems Engineering • FPT University

---

## 📋 MỤC LỤC
1. [Giới thiệu chung](#1-giới-thiệu-chung)
2. [Phần 1: Giải thích chi tiết Mục 01 đến Mục 04](#2-phần-1-giải-thích-chi-tiết-mục-01-đến-mục-04)
   - [Mục 01: Executive Summary & Keywords](#mục-01-executive-summary--keywords-tóm-tắt-tổng-quan--từ-khóa)
   - [Mục 02: Problem Statement & Solution](#mục-02-problem-statement--solution-vấn-đề--giải-pháp)
   - [Mục 03: System Architecture & Block Diagram](#mục-03-system-architecture--high-tech-block-diagram-kiến-trúc-hệ-thống)
   - [Mục 04: Hardware Specifications & Pin Configuration](#mục-04-hardware-specifications--pin-configuration-thông-số-phần-cứng)
3. [Phần 2: Giải thích chi tiết Mục 05 đến Mục 08](#3-phần-2-giải-thích-chi-tiết-mục-05-đến-mục-08)
   - [Mục 05: Firmware State Machine & False-Alarm Prevention](#mục-05-firmware-state-machine--false-alarm-prevention-máy-trạng-thái--lọc-báo-động-nhầm)
   - [Mục 06: HTTP Session Reuse & Cellular Telemetry (CỰC KỲ QUAN TRỌNG)](#mục-06-http-session-reuse--cellular-telemetry-tái-sử-dụng-phiên-http--viễn-trắc-4g)
   - [Mục 07: Cloud Server & Leaflet.js Web Dashboard](#mục-07-cloud-server--leafletjs-web-dashboard-máy-chủ-cloud--bản-đồ-web)
   - [Mục 08: Experimental Verification, Key Results & Future Work](#mục-08-experimental-verification-key-results--future-work-kết-quả-thực-nghiệm--hướng-phát-triển)
4. [Phần 3: Phân tích chuyên sâu 14 Bước Lệnh AT & Cơ chế HTTP Session Reuse](#4-phần-3-phân-tích-chuyên-sâu-14-bước-lệnh-at--cơ-chế-http-session-reuse)
   - [Ví dụ đời thường: Gọi điện đặt cơm vs Giữ đường dây](#ví-dụ-đời-thường-gọi-điện-đặt-cơm-vs-giữ-đường-dây)
   - [Bảng chi tiết 14 Bước Lệnh AT trong Code C trên STM32](#bảng-chi-tiết-14-bước-lệnh-at-trong-code-c-trên-stm32)
   - [Kịch bản trả lời Hội đồng bảo vệ về Mục 06](#kịch-bản-trả-lời-hội-đồng-bảo-vệ-về-mục-06)

---

## 1. GIỚI THIỆU CHUNG
Tài liệu này được soạn thảo dưới góc độ một **kỹ sư IoT đàn anh hướng dẫn đồ án**, bóc tách từng dòng câu chữ tiếng Anh trên Poster A0, dịch nghĩa sát sườn và giải thích sâu sắc bản chất kỹ thuật điện tử - viễn thông - vi điều khiển bên trong. Mục tiêu giúp nhóm sinh viên nắm vững 100% kiến thức lõi, tự tin trả lời mọi câu hỏi phản biện từ Hội đồng bảo vệ môn học MIP201.

---

## 2. PHẦN 1: GIẢI THÍCH CHI TIẾT MỤC 01 ĐẾN MỤC 04

### MỤC 01: EXECUTIVE SUMMARY & KEYWORDS (Tóm tắt tổng quan & Từ khóa)

#### 🔹 Câu 1 (Hệ thống tổng thể & Vi điều khiển)
> *"An advanced, end-to-end IoT motorcycle security system combining real-time positioning and a deterministic multi-stage escalation state machine using an **STM32F411** microcontroller."*

* **Dịch từng chữ:** Một hệ thống bảo vệ xe máy IoT tiên tiến, toàn diện từ đầu đến cuối (`end-to-end`), kết hợp định vị thời gian thực (`real-time positioning`) và máy trạng thái leo thang nhiều cấp định hướng (`deterministic multi-stage escalation state machine`) sử dụng vi điều khiển **STM32F411**.
* **Giải thích bản chất kỹ thuật:**
  * **`End-to-end IoT system` (Hệ thống IoT toàn diện từ đầu đến cuối):** Nhóm tự làm trọn vẹn toàn bộ chuỗi chu trình: Từ phần cứng cảm biến gắn trên xe $\rightarrow$ truyền dữ liệu qua mạng viễn thông 4G $\rightarrow$ máy chủ Cloud xử lý $\rightarrow$ đến tận giao diện Web/App trên điện thoại người dùng. Không phụ thuộc vào nền tảng hay app có sẵn bên thứ ba.
  * **`Deterministic multi-stage escalation state machine` (Máy trạng thái leo thang nhiều cấp mang tính định hướng):**
    * *`State Machine` (Máy trạng thái):* Cách lập trình cho chip STM32 hoạt động theo từng trạng thái rõ ràng (ví dụ: đang lái xe `TRACKING`, hay đang khóa `STANDBY`).
    * *`Multi-stage escalation` (Leo thang nhiều cấp):* Khi xe bị chạm nhẹ $\rightarrow$ chỉ cảnh báo cấp 1 (`ALERT_L1` kêu bíp ngắn); khi bị cạy phá liên tục $\rightarrow$ leo thang lên cảnh báo cấp 2 (`ALERT_L2` hú còi inh ỏi).
    * *`Deterministic` (Định hướng / Chắc chắn / Không ngẫu nhiên):* Thuật toán xử lý cực kỳ chính xác theo quy luật thời gian và số xung nhịp đã lập trình, 100% không bị treo hay báo động ngẫu nhiên.

#### 🔹 Câu 2 (Cảm biến định vị GPS & Chấn động)
> *"The system parses high-precision coordinates and velocity from a **u-blox NEO-7M GPS** receiver and senses mechanical disturbances via an **SW-420 vibration sensor**."*

* **Dịch từng chữ:** Hệ thống phân tích/bóc tách (`parses`) các tọa độ (`coordinates`) và vận tốc (`velocity`) độ chính xác cao từ bộ thu **u-blox NEO-7M GPS**, đồng thời cảm nhận các nhiễu loạn cơ học (`mechanical disturbances`) thông qua **cảm biến rung chấn SW-420**.
* **Giải thích chuyên ngành:**
  * **`Parses NMEA coordinates and velocity`:** Mạch GPS NEO-7M trả dữ liệu về dưới dạng chuỗi văn bản chuẩn quốc tế gọi là `NMEA-0183` (như `$GPRMC,...`). Từ `parses` nghĩa là chip STM32 dùng code C để bóc tách, cắt lọc lấy đúng số vĩ độ (`lat`), kinh độ (`lng`) và tốc độ (`speed`).
  * **`Mechanical disturbances` (Nhiễu loạn cơ học):** Cách nói hàn lâm của hiện tượng rung lắc, va đập, tác động cạy phá xe.

#### 🔹 Câu 3 (Viễn thông 4G & Tối ưu hóa giao thức HTTP)
> *"Cellular telemetry is executed by a **SIMCom A7680C 4G LTE module**, transmitting JSON payloads to a cloud-hosted **Node.js/Render REST API** utilizing optimized HTTP Session Reuse."*

* **Dịch từng chữ:** Quá trình đo đạc từ xa qua mạng di động (`cellular telemetry`) được thực hiện bởi **module SIMCom A7680C 4G LTE**, truyền tải các gói dữ liệu JSON (`JSON payloads`) lên **API REST viết bằng Node.js** lưu trữ trên đám mây **Render**, sử dụng kỹ thuật Tái sử dụng phiên HTTP (`HTTP Session Reuse`) đã được tối ưu hóa.
* **Giải thích chuyên ngành:**
  * **`Cellular telemetry` (Viễn trắc di động):** Quá trình thu thập thông số (tọa độ GPS, tốc độ, rung chấn) và gửi tự động qua mạng viễn thông 4G LTE.
  * **`JSON payloads` (Gói dữ liệu JSON):** Chuỗi dữ liệu nhẹ gửi đi dạng `{ "lat": 10.82, "lng": 106.62 }`, chuẩn mực của Web hiện đại.
  * **`HTTP Session Reuse` (Tái sử dụng phiên kết nối HTTP - ĐIỂM SÁNG ĐỒ ÁN):** Thông thường mỗi lần gửi dữ liệu 4G, mạch phải tạo kết nối SSL/TLS từ đầu mất 15-20 giây (`AT+HTTPINIT`). Nhóm giữ nguyên kết nối đó (`REUSE`), bỏ qua bước khởi tạo, giúp tốc độ gửi giảm xuống chỉ còn **~3–5 giây**.

#### 🔹 Câu 4 (Trang quản trị Web Dashboard)
> *"A responsive **Leaflet.js web dashboard** delivers live tracking with auto-follow, remote arming/disarming, and instant emergency horn overrides."*

* **Dịch từng chữ:** Một trang quản trị web linh hoạt/thích ứng (`responsive`) sử dụng thư viện bản đồ **Leaflet.js** cung cấp khả năng theo dõi trực tiếp với tính năng tự động bám theo (`auto-follow`), khóa/mở khóa xe từ xa (`remote arming/disarming`) và lập tức ghi đè còi báo động khẩn cấp (`emergency horn overrides`).
* **Giải thích chuyên ngành:**
  * **`Responsive`:** Web tự động căn chỉnh giao diện tối ưu dù mở trên máy tính hay màn hình điện thoại.
  * **`Auto-follow`:** Bản đồ tự động bám theo xe (`panTo`), người dùng không cần dùng tay kéo bản đồ liên tục.
  * **`Horn overrides` (Ghi đè còi báo động):** Dù còi đang hú do trộm bẻ khóa (`ALERT_L2`), chủ xe chỉ cần bấm nút tắt trên Web là lệnh từ Cloud lập tức gửi xuống xe để cúp còi ngay lập tức.

---

### MỤC 02: PROBLEM STATEMENT & SOLUTION (Vấn đề & Giải pháp)

#### 🔹 Vấn đề thực tế (Problem Statement)
> *"Motorcycle theft is a persistent challenge. Traditional acoustic alarms only act as local deterrents and frequently trigger annoying false alarms when bumped by casual passersby or heavy rain. Meanwhile, standalone GPS trackers lack immediate physical deterrents and suffer from high cellular latency. **GPS411** resolves these challenges:"*

* **Dịch từng chữ:** Trộm cắp xe máy là một thách thức dai dẳng. Các bộ còi báo động bằng âm thanh (`acoustic alarms`) truyền thống chỉ đóng vai trò răn đe tại chỗ (`local deterrents`) và thường xuyên kích hoạt các báo động nhầm (`false alarms`) gây phiền toái khi bị người đi đường va quệt nhẹ hoặc mưa lớn. Trong khi đó, các bộ định vị GPS độc lập lại thiếu các công cụ răn đe vật lý ngay lập tức (`immediate physical deterrents`) và bị độ trễ mạng di động cao (`high cellular latency`). **GPS411** giải quyết các thách thức này:
* **Phân tích nhược điểm thị trường:**
  1. *Khóa chống trộm kêu còi bán ngoài chợ:* Ai chạm nhẹ hay mưa rơi cũng hú còi inh ỏi làm phiền hàng xóm (`False alarms`).
  2. *Bộ định vị GPS bán sẵn:* Chỉ biết xem bản đồ, trộm dắt xe đi cũng không hú còi răn đe (`Lack physical deterrents`), mà mạng lại chậm (`High latency`).

#### 🔹 Hai Giải pháp cốt lõi (Our Solutions)
> * **`Deterministic Edge Defense & Smart False-Alarm Filtering`:** *Multi-stage acoustic escalation on the STM32F411 processes shocks locally in milliseconds (`ALERT_L1` warning vs `ALERT_L2` full siren), eliminating false triggers.*
> * **`Low-Latency Cellular Telemetry`:** *Persistent HTTP session connections reduce 4G transmission cycle times by over 60%, guaranteeing instant remote awareness nationwide.*

* **Dịch & Giải thích sâu:**
  * **`Deterministic Edge Defense` (Phòng thủ ngay tại thiết bị biên):** Từ `Edge` (Biên) chỉ con chip STM32 gắn trên xe. Chống trộm là phải xử lý **tại chỗ trong vài mili-giây** chứ không chờ đợi gửi lên Cloud rồi Cloud mới ra lệnh hú còi.
  * **`Smart False-Alarm Filtering` (Lọc báo động nhầm thông minh):** Cọ quẹt nhẹ hay tác động vô tình $\rightarrow$ chỉ kêu tít tít (`ALERT_L1`); rung liên tục trong 5 giây mới hú còi 60s (`ALERT_L2`). Triệt tiêu 100% báo động giả.
  * **`Persistent HTTP session` (Duy trì phiên kết nối HTTP dai dẳng):** Giảm thời gian gửi qua 4G tới hơn 60% (`giảm từ 20s xuống 3s`), giúp chủ xe ngồi ở bất kỳ tỉnh thành nào cũng nhận được cảnh báo ngay lập tức.

---

### MỤC 03: SYSTEM ARCHITECTURE & HIGH-TECH BLOCK DIAGRAM (Kiến trúc hệ thống)

> *"The system runs on the 32-bit ARM Cortex-M4 **STM32F411CEU6** running a non-blocking super-loop architecture (`while(1)`). Peripheral interfacing is segmented across dedicated buses: `USART1 (9600 baud)` parses NMEA-0183 sentences from the **NEO-7M GPS**, `USART2 (115200 baud)` manages AT commands with the **A7680C 4G LTE** module, and digital GPIO lines handle shock interrupts and drive the active buzzer."*

* **Dịch từng chữ:** Hệ thống chạy trên vi điều khiển 32-bit ARM Cortex-M4 **STM32F411CEU6** theo kiến trúc vòng lặp siêu tốc không chặn (`non-blocking super-loop architecture`). Giao tiếp ngoại vi được phân đoạn qua các đường truyền riêng biệt: `USART1` (tốc độ 9600 baud) phân tích chuỗi NMEA-0183 từ **NEO-7M GPS**, `USART2` (tốc độ 115200 baud) quản lý các lệnh AT với module **4G A7680C**, và các chân digital GPIO xử lý ngắt rung chấn và điều khiển còi chip.
* **Giải thích từ khóa kỹ thuật đỉnh cao:**
  * **`Non-blocking super-loop architecture (while(1))`:** Thay vì dùng hệ điều hành thời gian thực (RTOS) phức tạp làm nặng chip, nhóm dùng vòng lặp `while(1)` siêu nhanh kết hợp hàm đếm thời gian `HAL_GetTick()`. Nó giống như bạn hẹn giờ bằng đồng hồ bấm giây: chip liên tục kiểm tra `millis()` mà **không bao giờ dùng hàm `HAL_Delay()` gây đơ/trì trệ hệ thống**.
  * **`USART1 & USART2`:** Nhóm sử dụng 2 bộ truyền nhận nối tiếp (`USART`) độc lập của STM32 để không bị nghẽn: `USART1` chuyên đọc GPS (`9600 baud`), `USART2` chuyên giao tiếp 4G (`115200 baud`).

---

### MỤC 04: HARDWARE SPECIFICATIONS & PIN CONFIGURATION (Thông số phần cứng)

> *"All modules operate across dedicated buses (`5V` Battery Shield V3 & `3.3V` LDO bus) to eliminate voltage dips during cellular peak bursts (2A surge protection):"*

* **Dịch từng chữ:** Tất cả các module hoạt động trên các đường nguồn riêng biệt (Shield pin `5V` V3 & đường `3.3V` LDO) nhằm loại bỏ hiện tượng sụt áp (`voltage dips`) trong các đợt phát sóng đỉnh điểm của mạng di động (bảo vệ chống dòng phát tức thời 2A).
* **Giải thích lý do mạch chạy ổn định:**
  * Các mạch 4G/GSM (như A7680C) khi bắt sóng trạm BTS sẽ rút dòng điện tức thời lên tới **2 Ampe (`2A peak burst`)**. Nếu dùng chung nguồn yếu, mạch sẽ bị **sụt áp (`voltage dips`)** làm vi điều khiển STM32 bị sập nguồn/khởi động lại (`Brown-out Reset`).
  * Nhóm đã thiết kế nguồn mạch chuẩn chỉ: dùng **Battery Shield V3 (Pin 18650)** gánh dòng 5V cho mạch 4G/còi, và qua mạch ổn áp LDO 3.3V cấp riêng cho STM32, giúp hệ thống chạy cực kỳ ổn định.

---

## 3. PHẦN 2: GIẢI THÍCH CHI TIẾT MỤC 05 ĐẾN MỤC 08

### MỤC 05: FIRMWARE STATE MACHINE & FALSE-ALARM PREVENTION (Máy trạng thái & Lọc báo động nhầm)

#### 🔹 Kiến trúc Code Firmware
> *"The firmware eliminates RTOS overhead by deploying a deterministic, non-blocking super-loop (`while(1)`) governed by `HAL_GetTick()` timers with two-tier shock escalation:"*

* **Dịch từng chữ:** Bộ code vi điều khiển (`firmware`) loại bỏ gánh nặng tài nguyên của hệ điều hành thời gian thực (`RTOS overhead`) bằng cách triển khai một vòng lặp chính siêu tốc không bị nghẽn (`non-blocking super-loop while(1)`), được kiểm soát bởi các bộ đếm thời gian `HAL_GetTick()` với cơ chế leo thang rung chấn hai cấp độ (`two-tier shock escalation`).
* **Giải thích chuyên sâu:**
  * **`RTOS overhead` (Gánh nặng của RTOS):** Dùng hệ điều hành FreeRTOS trên chip nhỏ đôi khi gây lãng phí RAM/ROM cho việc chia nhỏ luồng (`Task Switching`). Nhóm tự viết thuật toán quản lý thời gian phi cản trở (`Non-blocking`).
  * **`Governed by HAL_GetTick() timers`:** Chip STM32 có hàm `HAL_GetTick()` trả về số mili-giây từ lúc bật máy. Công thức `(HAL_GetTick() - previousTick >= interval)` giúp chip vừa đọc GPS, vừa kiểm tra 4G, vừa nghe chấn động cùng một lúc mà không bao giờ bị đơ.

#### 🔹 Hộp thông tin: Thuật toán tránh báo động nhầm (`Smart False-Alarm Prevention`)
> * **`Accidental Bump (ALERT_L1)`:** *A single shock pulse (`PA0`) triggers only a brief, polite warning beep (200ms ON / 800ms OFF) and opens a 5-second sampling window.*
> * **`True Theft Attempt (ALERT_L2)`:** *Only when cumulative shocks inside the 5-second window exceed threshold (`vib_count >= L1_TO_L2_COUNT`) does the system confirm actual physical tampering and unleash the 60-second high-decibel siren.*
> * **`Instant Remote Cutoff`:** *Owners can instantly silence active sirens via the web dashboard (`Alert_HornOff()`) in $< 4\text{ seconds}$ without disabling tracking.*

* **Dịch từng chữ & Bản chất kỹ thuật:**
  * **`Accidental Bump -> ALERT_L1` (Va quệt vô tình):** Khi có một xung nháy duy nhất (`PA0` nhảy lên mức HIGH do vô tình đụng xe), xe **KHÔNG HÚ CÒI NGAY**. Nó chỉ phát ra một tiếng bíp ngắn lịch sự (`polite warning beep`: kêu 200ms rồi tắt 800ms) để nhắc nhở, đồng thời **mở ra một cửa sổ thời gian 5 giây (`5-second sampling window`)**.
  * **`True Theft Attempt -> ALERT_L2` (Hành vi trộm cắp thực sự):** Trong vòng 5 giây tiếp theo đó, chip liên tục đếm số lần rung (`vib_count`). Chỉ khi trộm cạy bẻ khóa làm xe rung liên tục vượt ngưỡng cho phép (`vib_count >= L1_TO_L2_COUNT`), hệ thống mới xác nhận đây là vụ trộm thật và kích hoạt còi hú cường độ cao trong 60 giây (`60-second high-decibel siren`).
  * **`Instant Remote Cutoff` (Cúp còi từ xa tức thì):** Nếu trộm cạy xe làm còi hú, chủ xe chỉ cần bấm nút trên Web Dashboard. Lệnh `Alert_HornOff()` gửi xuống xe trong vòng dưới 4 giây để tắt còi mà **vẫn giữ nguyên chế độ định vị xe** (`without disabling tracking`).

---

### MỤC 06: HTTP SESSION REUSE & CELLULAR TELEMETRY (Tái sử dụng phiên HTTP & Viễn trắc 4G)

#### 🔹 Tối ưu hóa giao thức viễn thông
> *"Standard cellular HTTP POST cycles require ~20 seconds due to repeated SSL/TLS handshakes (`AT+HTTPINIT`, `CSSLCFG`, `SSLCFG`). GPS411 implements **Persistent HTTP Session Reuse**:"*
> * **`First Cycle (POST)`:** *Executes full 14-step setup (`STOP` $\rightarrow$ `SSL` $\rightarrow$ `INIT` $\rightarrow$ `POST` $\rightarrow$ `DONE`).*
> * **`Reused Cycles (REUSE)`:** *Skips directly to step 9 (`DATA` $\rightarrow$ `BODY` $\rightarrow$ `ACTION` $\rightarrow$ `READ` $\rightarrow$ `DONE`).*
> * **`Performance Gain`:** *Cycle latency reduced from **~20s down to ~3–5s**.*

* **Giải thích bản chất đột phá:**
  * Khi gửi dữ liệu qua mạng 4G bảo mật HTTPS (`SSL/TLS handshakes`), mạch A7680C phải thương lượng khóa bảo mật với Server render.com (`INIT`, `CSSLCFG`, `SSLCFG`). Quá trình này rất mất thời gian. Nếu mỗi lần gửi xong lại đóng kết nối (`AT+HTTPTERM`), lần sau gửi lại phải khởi tạo từ đầu $\rightarrow$ mất 20 giây.
  * **Kỹ thuật `Persistent HTTP Session Reuse`:**
    * **`First Cycle (POST)` (Lần gửi đầu tiên khi vừa bật máy):** Hệ thống chạy đủ 14 bước thiết lập ban đầu.
    * **`Reused Cycles (REUSE)` (Từ lần thứ 2 trở đi):** Chip **không ngắt kết nối** mà giữ nguyên phiên làm việc đó. Code nhảy thẳng đến bước 9 (`nhập số byte dữ liệu DATA -> gửi BODY -> thực thi ACTION POST -> đọc kết quả READ -> XONG`).
    * **`Performance Gain`:** Thời gian gửi giảm kỷ lục từ **20 giây xuống chỉ còn 3 đến 5 giây**.

---

### MỤC 07: CLOUD SERVER & LEAFLET.JS WEB DASHBOARD (Máy chủ Cloud & Bản đồ Web)

> *"The cloud backend runs on **Node.js / Express.js** deployed on **Render Cloud**, buffering the last 50 GPS waypoints (`history`) and queuing asynchronous control commands:"*
> * **`Smart Auto-Follow (panTo)`:** *Leaflet.js automatically pans to follow the vehicle smoothly. When the user manually drags the map to inspect streets, auto-follow yields control instantly, showing a **"📍 Center"** snap-back button.*
> * **`Real-Time 2-Second Polling (2000 ms)`:** *Live status indicators for GPS Fix (`#68d391`), vehicle velocity, protection status, and horn state (`📢 Đang kêu`).*
> * **`Low Cellular Footprint`:** *Highly optimized payloads consume only **~10 MB – 40 MB per day**, allowing continuous 24/7 telemetry on basic SIM plans.*

* **Giải thích tính năng Web:**
  * **`Buffering the last 50 GPS waypoints`:** Server Node.js lưu lại 50 vị trí xe đi qua gần nhất trong mảng RAM (`history`) để vẽ ra quỹ đạo di chuyển màu xanh trên bản đồ.
  * **`Smart Auto-Follow (panTo)`:** Bản đồ tự động trượt theo xe. Nhưng nếu người dùng lấy tay kéo bản đồ ra chỗ khác (`manually drags`), hệ thống thông minh nhường quyền điều khiển ngay (`yields control`) và hiện lên nút **"📍 Center" (Quay lại xe)** để tự động hút về vị trí xe khi cần.
  * **`Real-Time 2-Second Polling`:** Web trình duyệt tự động hỏi Server 2 giây/lần (`fetch /api/latest`) để cập nhật con trỏ xe chớp nháy mượt mà.
  * **`Low Cellular Footprint` (Tiêu tốn dung lượng 4G siêu thấp):** Do gói JSON siêu nhỏ, xe chạy liên tục 24/7 chỉ tốn khoảng **10 MB đến 40 MB data một ngày**.

---

### MỤC 08: EXPERIMENTAL VERIFICATION, KEY RESULTS & FUTURE WORK (Kết quả thực nghiệm & Hướng phát triển)

#### 🔹 Kết quả kiểm chứng thực tế (`Verified Performance & Reliability`)
> * **`End-to-End Latency`:** *Verified round-trip cellular latency of **~3 to 5 seconds** using HTTP Session Reuse, compared to >19s in unoptimized polling mode.*
> * **`Acoustic Override & False-Alarm Prevention`:** *The two-tier `vib_count` window accurately filters out 100% of single accidental bumps (`ALERT_L1`). Web-initiated `HORN_OFF` successfully overrides active `ALERT_L2` sirens nationwide in $< 4\text{ seconds}$.*

* **Dịch & Khẳng định thành công:**
  * **`Round-trip latency ~3 to 5 seconds`:** Đã đo đạc thực tế độ trễ vòng lặp (từ lúc xe rung $\rightarrow$ gửi lên Cloud $\rightarrow$ Web nhận được $\rightarrow$ bấm nút cúp còi từ Web gửi xuống xe) chỉ tốn **3 đến 5 giây**.
  * **`Accurately filters out 100% of accidental bumps`:** Thuật toán cửa sổ 5 giây đã loại bỏ thành công 100% các tình huống va quệt nhầm ngoài đường.

#### 🔹 Hướng phát triển tương lai (`Conclusion & Future Roadmap`)
> * **`Protocol Migration`:** *Transitioning from HTTP POST polling to **MQTT over SSL / WebSockets** to achieve sub-second bidirectional command latency.*
> * **`Geofencing & SMS Fallback`:** *Virtual geofence radii that trigger direct cellular SMS alerts when leaving boundaries.*
> * **`ADC Battery Monitoring`:** *Sampling vehicle battery voltage (`PB0/ADC1`) to alert users before battery drain occurs.*

* **Giải thích hướng đi tiếp theo:**
  1. **`Protocol Migration (MQTT / WebSockets)`:** Chuyển từ HTTP POST sang giao thức **MQTT** hoặc **WebSockets**. Khi dùng MQTT, xe và Cloud duy trì một ống nối trực tiếp (`persistent TCP socket`), giúp độ trễ nhận lệnh từ Web xuống xe giảm xuống dưới 1 giây (`sub-second latency`).
  2. **`Geofencing & SMS Fallback` (Hàng rào địa lý & SMS dự phòng):** Vẽ một vòng tròn bán kính 100m trên bản đồ (`Geofence`). Nếu xe bị dắt ra khỏi vòng tròn, mạch A7680C tự động gửi tin nhắn SMS (`AT+CMGS`) thẳng vào số điện thoại chủ xe phòng khi vùng đó bị mất sóng 3G/4G Internet.
  3. **`ADC Battery Monitoring` (Theo dõi điện áp bình ắc-quy):** Dùng bộ chuyển đổi tương tự - số (`ADC1` tại chân `PB0`) của STM32 để đo điện áp bình ắc-quy 12V của xe máy. Nếu bình yếu dưới 11.5V, gửi cảnh báo lên Web để chủ xe sạc trước khi xe hết điện.

---

## 4. PHẦN 3: PHÂN TÍCH CHUYÊN SÂU 14 BƯỚC LỆNH AT & CƠ CHẾ HTTP SESSION REUSE

### VÍ DỤ ĐỜI THƯỜNG: GỌI ĐIỆN ĐẶT CƠM VS GIỮ ĐƯỜNG DÂY
Hãy tưởng tượng việc **gửi dữ liệu tọa độ GPS lên Cloud** giống như việc bạn **gọi điện thoại cho quán cơm để đặt món**:

* **Cách thông thường cồng kềnh (Chạy đủ 14 bước mỗi lần đặt cơm):**
  1. Mở khóa điện thoại $\rightarrow$ 2. Mở danh bạ $\rightarrow$ 3. Tìm số quán cơm $\rightarrow$ 4. Bấm nút gọi $\rightarrow$ 5. Chờ nhà mạng nối máy $\rightarrow$ 6. Nhân viên nhấc máy $\rightarrow$ 7. Chào hỏi thủ tục bảo mật $\rightarrow$ 8. Xác nhận địa chỉ giao hàng $\rightarrow$ **9. Đọc món ăn muốn đặt (`{"lat":10.82,...}`)** $\rightarrow$ **10. Quán xác nhận đơn (`HTTPACTION`)** $\rightarrow$ **11. Quán báo giá (`HTTPREAD`)** $\rightarrow$ 12. Cảm ơn $\rightarrow$ **13. Cúp máy (`HTTPTERM`)** $\rightarrow$ 14. Khóa điện thoại.
  👉 *Nhược điểm:* Cứ 5 giây sau muốn đặt thêm món nữa, bạn lại phải mở khóa, tìm số, gọi lại từ đầu... Mỗi lần mất **20 giây**!

* **Cách tối ưu của nhóm (`HTTP Session Reuse` - Giữ máy không cúp!):**
  * **Lần đầu tiên (`First Cycle`):** Bạn làm đủ các bước từ 1 đến 11 để nối máy và đặt món đầu tiên. Nhưng khi xong, **KHÔNG CÚP MÁY (`Không chạy lệnh HTTPTERM`)** mà giữ nguyên đường dây thoại đó!
  * **Từ lần thứ 2 trở đi (`Reused Cycles`):** Vì đường dây vẫn đang kết nối sẵn với nhân viên quán cơm, bạn **BỎ QUA HOÀN TOÀN BƯỚC 1 ĐẾN BƯỚC 8**, nhảy thẳng ngay vào **Bước 9**: *"Anh ơi cho em thêm 1 cơm sườn nữa!"* (`HTTPDATA -> HTTPACTION -> HTTPREAD`).
  👉 *Kết quả:* Đặt món siêu tốc, thời gian giảm từ **20 giây xuống chỉ còn 3–5 giây**!

---

### BẢNG CHI TIẾT 14 BƯỚC LỆNH AT TRONG CODE C TRÊN STM32
Dưới đây là chính xác những gì chip **STM32F411** gửi qua cổng `USART2` cho mạch **A7680C 4G** để đẩy dữ liệu lên máy chủ Render:

#### 🔴 GIAI ĐOẠN 1: Dọn dẹp & Khởi tạo bộ máy bảo mật SSL (Bước 1 $\rightarrow$ 3)
| Bước | Lệnh AT STM32 gửi cho mạch 4G | Giải thích bản chất kỹ thuật |
| :---: | :--- | :--- |
| **1** | `AT+HTTPTERM` | Dừng/dọn dẹp các kết nối HTTP cũ (nếu có bị treo trước đó). |
| **2** | `AT+CSSLCFG="sslversion",0,4` | Cấu hình bật bảo mật SSL/TLS (vì Server Render dùng `HTTPS`). |
| **3** | `AT+CSSLCFG="authmode",0,0` | Tắt xác thực chứng chỉ rườm rà để kết nối nhanh hơn. |

#### 🟡 GIAI ĐOẠN 2: Khởi tạo dịch vụ HTTP & Điền địa chỉ Server (Bước 4 $\rightarrow$ 8)
| Bước | Lệnh AT STM32 gửi cho mạch 4G | Giải thích bản chất kỹ thuật |
| :---: | :--- | :--- |
| **4** | `AT+HTTPINIT` | **Khởi động dịch vụ HTTP** trong bộ nhớ RAM của mạch A7680C. |
| **5** | `AT+HTTPPARA="CID",1` | Chọn cấu hình mạng 4G LTE (`APN Profile ID = 1`) để ra Internet. |
| **6** | `AT+HTTPPARA="URL","https://gps411-server.onrender.com/api/data"` | Điền **địa chỉ URL máy chủ Cloud Render** của nhóm. |
| **7** | `AT+HTTPPARA="CONTENT","application/json"` | Báo cho Server biết: *"Tôi chuẩn bị gửi lên dữ liệu dạng JSON nhé"*. |
| **8** | `AT+HTTPPARA="USERDATA","User-Agent: STM32"` | Đặt tên định danh cho thiết bị (`Header`). |

*(⏳ Lưu ý: Khi mạch 4G thực hiện từ Bước 1 đến Bước 8, nó phải thiết lập mạng và xác thực bảo mật SSL với máy chủ Render ở Mỹ, nên mất khoảng **8 đến 12 giây**!)*

---

#### 🟢 GIAI ĐOẠN 3: Đổ dữ liệu JSON & Bấm nút gửi (`POST`) (Bước 9 $\rightarrow$ 12)
**👉 ĐÂY CHÍNH LÀ TRỌNG TÂM: TỪ LẦN THỨ 2 TRỞ ĐI, CODE CHỈ CHẠY 4 BƯỚC NÀY!**

| Bước | Lệnh AT STM32 gửi cho mạch 4G | Giải thích bản chất kỹ thuật |
| :---: | :--- | :--- |
| **9** | `AT+HTTPDATA=120,10000` | Báo mạch 4G: *"Tôi chuẩn bị nạp vào **120 byte** chữ JSON, hãy đợi tôi nạp trong 10 giây"* $\rightarrow$ Mạch báo lại `DOWNLOAD`. |
| **10** | `{"lat":10.8231,"lng":106.6297,"speed":35.4,"state":"STANDBY","armed":1,"horn":0}` | STM32 bơm chuỗi JSON chứa tọa độ GPS và trạng thái xe qua chân TX/RX vào mạch 4G $\rightarrow$ Mạch báo `OK`. |
| **11** | `AT+HTTPACTION=1` | **RA LỆNH GỬI (`Action 1 = HTTP POST`)!** Mạch 4G phát sóng bắn gói JSON lên trạm BTS $\rightarrow$ Cloud nhận được và trả lời về `+HTTPACTION: 1,200,18` (`200` là thành công, có `18 byte` lệnh trả về). |
| **12** | `AT+HTTPREAD=0,18` | STM32 đọc `18 byte` từ Cloud trả về (chính là chuỗi `{"cmd":"HORN_OFF"}` để xe biết đường tắt còi hoặc khóa xe). |

---

#### 🟣 GIAI ĐOẠN 4: Đóng kết nối / Ngắt phiên (Bước 13 $\rightarrow$ 14)
| Bước | Lệnh AT STM32 gửi cho mạch 4G | Giải thích bản chất kỹ thuật |
| :---: | :--- | :--- |
| **13** | `AT+HTTPTERM` | **Hủy/Đóng kết nối HTTP**, xóa địa chỉ URL khỏi RAM mạch 4G. |
| **14** | `AT+CSSLCFG... (Close)` | Đóng phiên bảo mật SSL. |

---

### KỊCH BẢN TRẢ LỜI HỘI ĐỒNG BẢO VỆ VỀ MỤC 06

Khi Hội đồng hỏi: *"Em hãy giải thích rõ cơ chế `HTTP Session Reuse` ở Mục 06 cho thầy nghe!"*, sinh viên trả lời dõng dạc theo 3 ý sau:

1. *"Dạ thưa thầy, thông thường khi dùng module 4G A7680C để gửi HTTP POST, code phải chạy trọn vẹn **14 lệnh AT** từ lúc khởi tạo (`AT+HTTPINIT`), cấu hình URL (`AT+HTTPPARA`), gửi dữ liệu (`AT+HTTPACTION`) cho đến lúc cúp kết nối (`AT+HTTPTERM`). Mỗi lần gửi phải thiết lập lại bảo mật SSL từ đầu nên mất tới **20 giây**!"*
2. *"Nhóm em đã nghiên cứu và phát hiện ra sự lãng phí đó. Nên ở **Lần gửi đầu tiên (`First Cycle`)**, tụi em cho chạy từ Bước 1 đến Bước 12. Nhưng gửi xong, **code của tụi em tuyệt đối KHÔNG gọi lệnh cúp kết nối `AT+HTTPTERM` (bỏ qua bước 13-14)** mà giữ nguyên dịch vụ `HTTPINIT` và cấu hình URL trong RAM của mạch 4G."*
3. *"Khi xe di chuyển, cứ 3-5 giây sau cần gửi tọa độ mới (**Reused Cycles**), vì URL và kết nối SSL vẫn đang sống sẵn, code STM32 của tụi em **bỏ qua hoàn toàn từ Bước 1 đến Bước 8**, nhảy thẳng vào **Bước 9 (`AT+HTTPDATA`) -> Bước 10 (Nạp JSON) -> Bước 11 (`AT+HTTPACTION=1`) và Bước 12 (`AT+HTTPREAD`)**. Nhờ chỉ chạy đúng 4 lệnh cốt lõi này, độ trễ viễn trắc giảm kỷ lục xuống dưới **3 đến 5 giây**, giúp bản đồ theo dõi xe mượt mà gần như tức thì ạ!"*
