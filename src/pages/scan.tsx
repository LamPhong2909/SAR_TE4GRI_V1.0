//SỬ DỤNG // import { closeLoading } from "zmp-sdk";
// // ĐỂ TẮT LOADING SCREEN KHI MỞ ỨNG DỤNG LẦN ĐẦU TIÊN
// // Đoạn này sẽ được gọi trong useEffect của component gốc (App.tsx) để tắt loading screen sau khi ứng dụng đã sẵn sàng

// File code này rất quan trọng trong việc quản lý camera và xử lý ảnh trong ứng dụng TE4GRI. Nó sử dụng các kỹ thuật hiện đại trong React để cung cấp trải nghiệm người dùng mượt mà và hiệu quả.


// "XỬ LÝ ẢNH" trong file code này có liên quan đến computer vision thế nào ? 
//// - "Xử lý ảnh" trong file code này liên quan đến việc chụp ảnh từ camera, chuyển đổi ảnh sang định dạng base64, và gửi ảnh tới Roboflow để nhận kết quả xử lý.
// - ngoài ra nó còn liên quan đến việc hiển thị ảnh đã chụp và kết quả xử lý trên giao diện người dùng.
// - Để tăng cường độ tinh vi và toàn diện thì trong tương lai sẽ có thêm các tính năng như nhận diện cây trồng, phân loại ảnh, và xử lý các tùy chọn chất lượng ảnh.
// - "nhận diện cây trồng" ở đây chỉ là 1 phần của computer vision vì phần lớn đã được xử lý bên roboflow đúng không?
// - Đúng vậy, "nhận diện cây trồng" trong file code này chủ yếu được thực hiện thông qua Roboflow, một dịch vụ bên ngoài chuyên về computer vision. Tuy nhiên, việc chụp ảnh, chuyển đổi định dạng, và hiển thị kết quả vẫn là các bước quan trọng trong quá trình xử lý ảnh.
// - Thế tức là các bước preprocessing trong inference pipeline của computer vision sẽ được thực hiện chủ yếu ở file code này ?
// - Đúng vậy, các bước preprocessing như chụp ảnh, chuyển đổi định dạng, và hiển thị kết quả sẽ được thực hiện trong file code này. Tuy nhiên, việc nhận diện cây trồng và phân loại ảnh sẽ được thực hiện thông qua Roboflow, nơi đã được huấn luyện mô hình computer vision để xử lý các tác vụ này.
// - Thế nhưng , liệu có nên dồn chức năng tinh vi như vậy(Preprocessing toàn diện) vào 1 file code không ? Hay nên chia nhỏ ra thành các module hoặc component riêng biệt để dễ quản lý và bảo trì ?
// - Đây là một câu hỏi rất hay. Trong thực tế, việc chia nhỏ chức năng thành các module hoặc component riêng biệt sẽ giúp mã nguồn dễ quản lý, bảo trì và mở rộng hơn.
// - Trong trường hợp này, bạn có thể tách các chức năng như quản lý camera, xử lý ảnh, và hiển thị kết quả thành các component hoặc hook riêng biệt.
// - Còn đối với 1 phạm trù tinh vi và phức tạp như Preprocessing thời gian thực trong inference pipeline của computer vision thì nên chia nhỏ ra thành các module hoặc component riêng biệt để dễ quản lý và bảo trì.
// - Đúng vậy, đối với các tác vụ phức tạp như preprocessing trong inference pipeline của computer vision, việc chia nhỏ thành các module hoặc component riêng biệt sẽ giúp mã nguồn dễ quản lý, bảo trì và mở rộng hơn.

//
/*
Các thành phần cần test(sử dụng folder "Testing" trong src để chứa các tệp test): : 
*/

//1. Camera Context Management:
// - Kiểm tra việc khởi tạo camera context khi videoNode sẵn sàng.
// - Kiểm tra việc dừng camera khi component unmount hoặc khi chuyển trạng thái.
//// - Kiểm tra việc xử lý lỗi khi không thể khởi tạo camera.
//2. Image Capture and Processing:
// - Kiểm tra việc chụp ảnh từ camera và chuyển đổi sang base64.
// - Kiểm tra việc gửi ảnh đã chụp tới Roboflow và nhận kết quả xử lý.
// - Kiểm tra việc hiển thị ảnh đã chụp và kết quả xử lý.
//3. State management và UI Rendering:
// - Kiểm tra việc chuyển đổi giữa các trạng thái (CAMERA_PREVIEW, IMAGE_CAPTURED, PROCESSING, SHOWING_RESULT, CAMERA_ERROR).
// - Kiểm tra việc hiển thị thông báo lỗi khi camera không hoạt động.
// - KIểm tra ImageCapture và hiển thị ảnh đã chụp trong giao diện người dùng.
// - KIểm tra Processing và hiển thị ảnh đã xử lý trong giao diện người dùng.
// - KIểm tra ShowingResult và hiển thị kết quả nhận diện cây trồng trong giao diện người dùng.
// - Kiểm tra CameraError và hiển thị thông báo lỗi khi có sự cố với camera.
//4. Plant Selection:
// - Kiểm tra việc chọn loại cây và hiển thị ảnh tương ứng.
// -Kiểm tra việc mở và đóng dropdown chọn loại cây.
// - Kiểm tra việc hiển thị ảnh đại diện của loại cây đã chọn.
// - KIểm tra việc hiển thị danh sách các loại cây và cho phép người dùng chọn loại cây mong muốn.
//5. Camera Permission:
// - Kiểm tra việc yêu cầu quyền truy cập camera và xử lý kết quả.
//  - Kiểm tra việc hiển thị thông báo lỗi khi không có quyền truy cập camera.
// - Kiểm tra việc hiển thị thông báo "Đang khởi động camera..." khi camera đang được khởi tạo.
// 6. Camera Error Handling:
// - Kiểm tra việc hiển thị thông báo lỗi khi có sự cố với camera.
// - Kiểm tra việc xử lý lỗi khi không thể chụp ảnh hoặc gửi ảnh tới Roboflow.
// - KIểm tra việc hiển thị thông báo lỗi khi không thể khởi động camera hoặc khi có lỗi trong quá trình xử lý ảnh.
// 7. Navigation and User Interaction:
// - Kiểm tra việc điều hướng đến trang kết quả khi ảnh đã được xử lý. (Trang kết quả CHÍNH LÀ trang TE4BOT sắp ra mắt, nhưng mình cần biết là liệu trước khi qua trang TE4BOT thì có nên ở trang scan trước ?)
// - KIểm tra việc hiển thị các nút bấm và chức năng của chúng (chụp ảnh, chọn ảnh từ thư viện, xác nhận ảnh).
// - Kiểm tra việc hiển thị các thông báo và hướng dẫn cho người dùng trong quá trình sử dụng ứng dụng.
// 8. Camera Initialization and Cleanup:
// - Kiểm tra việc khởi tạo camera khi component được mount.
// - Kiểm tra việc dừng camera khi component unmount hoặc khi chuyển sang trạng thái khác.
//9. Camera Flip Functionality (nếu có):
// - Kiểm tra việc lật camera (nếu hỗ trợ) và hiển thị ảnh tương ứng. 
// - KIểm tra việc lật camera khi người dùng nhấn nút lật camera (nếu có hỗ trợ trong CameraContext).
// 10. Camera Preview and Video Element:
// - Kiểm tra việc hiển thị camera preview trong thẻ video.
// - Kiểm tra việc cập nhật video element khi camera context thay đổi.
// - Kiểm tra việc video element được mount và unmount đúng cách khi component được mount/unmount.
// - Kiểm tra việc video element được cập nhật đúng khi camera context thay đổi (ví dụ: khi lật camera hoặc chuyển đổi giữa các chế độ camera).
// 11. Camera Quality Settings (nếu có):
// - Kiểm tra việc chụp ảnh với các tùy chọn chất lượng khác nhau (low, medium, high).
// - Kiểm tra việc hiển thị thông báo cho người dùng khi chụp ảnh với chất lượng thấp hoặc không đủ ánh sáng.
// -KIểm tra việc xử lý các tùy chọn chất lượng ảnh trong CameraContext và đảm bảo chúng hoạt động đúng. (giống như trong handleCaptureImage, nếu có tùy chọn quality thì sẽ sử dụng nó, nếu không thì sẽ sử dụng mặc định là 'high'). Giống như Gemini AI studio ấy
//12. Camera Context Reinitialization:
// - Kiểm tra việc khởi tạo lại camera context khi videoNode thay đổi hoặc khi chuyển trạng thái từ CAMERA_ERROR về CAMERA_PREVIEW.
// - Kiểm tra việc đảm bảo camera context được khởi tạo lại đúng cách khi người dùng quay lại trang scan từ trang kết quả.
// - Kiểm tra việc camera context được khởi tạo lại khi người dùng chọn loại cây khác hoặc khi có thay đổi trong cấu hình camera.



// Mức độ tinh vi của file code này thế nào ? 
// Đây là một file code khá tinh vi, sử dụng nhiều kỹ thuật hiện đại trong React như hooks, useCallback, useRef, và quản lý trạng thái phức tạp.
// - Nó bao gồm việc quản lý camera context, xử lý ảnh, và tương tác với API bên ngoài (Roboflow).
// - Nó cũng xử lý các trạng thái khác nhau của ứng dụng (chế độ xem camera, ảnh đã chụp, lỗi camera, v.v.) và cung cấp giao diện người dùng tương tác.
// - Nó cũng sử dụng các kỹ thuật như callback refs để quản lý video element, giúp đảm bảo rằng camera context được khởi tạo và dừng đúng cách.
// - Nó có khả năng xử lý lỗi và cung cấp trải nghiệm người dùng mượt mà, bao gồm việc hiển thị thông báo lỗi và trạng thái khởi tạo camera.
// - Nó sử dụng các thư viện bên ngoài như ZMP SDK để quản lý camera và quyền truy cập, và Cloudinary để hiển thị ảnh.
// - Nó cũng sử dụng các thư viện bên ngoài như Cloudinary để hiển thị ảnh, và ZMP SDK để quản lý camera và quyền truy cập.
// - Nó có cấu trúc rõ ràng, dễ đọc và bảo trì, với các hàm callback được sử dụng để quản lý các sự kiện và trạng thái khác nhau.
// - Nó cũng có khả năng mở rộng, cho phép thêm các loại cây mới hoặc thay đổi cấu hình camera mà không cần thay đổi quá nhiều mã nguồn.
// - Nó có thể được sử dụng trong các ứng dụng thực tế để nhận diện cây trồng và cung cấp thông tin hữu ích cho người dùng, đặc biệt trong lĩnh vực nông nghiệp thông minh.Ref.current.isUsing()) {
//           console.log("handleChooseImage: Camera context đang sử dụng, không cần khởi tạo lại.");
//          return;
//       }
//       console.log("handleChooseImage: Bắt đầu tiến trình chọn ảnh từ thư viện.");
//       setScanState(ScanState.PROCESSING); // Chuyển sang trạng thái xử lý
//       setIsInitializingCamera(true); // Hiển thị loading UI
//       setCameraError(null); // Đặt lại lỗi camera
//       try {
//         // Giả sử bạn có một hàm để mở thư viện ảnh và chọn ảnh
//         const selectedImage = await openImageLibrary(); // Hàm này cần được định nghĩa để mở thư viện ảnh
//         if (!selectedImage) {
//           console.warn("handleChooseImage: Không có ảnh nào được chọn.");
//           setScanState(ScanState.CAMERA_PREVIEW); // Quay lại trạng thái camera preview
//           setIsInitializingCamera(false); // Tắt loading UI
//           return;
//         }
//         console.log("handleChooseImage: Ảnh đã chọn:", selectedImage);
//         // Giả sử ảnh được chọn là base64, nếu không thì cần chuyển đổi
//         setCapturedImage(selectedImage); // Lưu ảnh đã chọn
//         setScanState(ScanState.IMAGE_CAPTURED); // Chuyển sang trạng thái ảnh đã chụp
//         // Tiến hành xử lý ảnh đã chọn
//         await processCapturedImage(selectedImage); // Hàm này cần được định nghĩa để xử lý ảnh
//         setIsInitializingCamera(false); // Tắt loading UI
//       } catch (error: any) {
//         console.error("handleChooseImage: Lỗi khi chọn ảnh từ thư viện:", error);
//         setCameraError(error.message || "Không thể chọn ảnh từ thư viện. Vui lòng thử lại.");
//         setScanState(ScanState.CAMERA_ERROR); // Chuyển sang trạng thái lỗi camera
//         setIsInitializingCamera(false); // Tắt loading UI
//       }
//    }, [videoNode]); // Chỉ gọi lại khi videoNode thay đổi


// Hiện tại ,đối với toàn cục dự án thì file scan.tsx có lẽ là chức năng và file code cần được test nhất phải không ?

// // - Đúng vậy, file `scan.tsx` là một trong những chức năng quan trọng nhất trong dự án TE4GRI, vì nó liên quan đến việc quản lý camera, xử lý ảnh và nhận diện cây trồng.
// - Nó có nhiều thành phần phức tạp và tương tác với các API bên ngoài, do đó việc test nó sẽ giúp đảm bảo rằng các chức năng này hoạt động đúng cách.
// - Việc test các chức năng này sẽ giúp phát hiện sớm các lỗi và đảm bảo rằng ứng dụng hoạt động mượt mà và ổn định.
// === QUẢN LÝ CAMERA VÀ PERMISSION ===
// - Bắt đầu với việc yêu cầu quyền truy cập camera từ người dùng.
// - Nếu được cấp quyền, tạo context camera và bắt đầu hiển thị camera preview.
// - Nếu không được cấp quyền, hiển thị thông báo lỗi và hướng dẫn người dùng cấp quyền.
// - Nếu camera đã được khởi tạo và đang sử dụng, không cần khởi tạo lại.
// - Nếu videoNode chưa sẵn sàng, không thể khởi tạo camera context.
// - Nếu camera context đã tồn tại và đang sử dụng, không cần khởi tạo lại.
// - Nếu camera context không tồn tại, tạo mới và bắt đầu camera preview.
// - Nếu videoNode đã sẵn sàng, tiến hành khởi tạo camera context.

// Hiện thì ngoài file scan.tsx rất cần được unit test vì độ tinh vi và quan trọng của nó nhưng file code nào sẽ có tiềm năng để đạt độ tinh vi tương tự ?

// - Trong dự án TE4GRI, file code có tiềm năng để đạt độ tinh vi tương tự như `scan.tsx` có thể là các file liên quan đến quản lý dữ liệu và tương tác với API, chẳng hạn như:
// - `dataService.ts`: Quản lý việc lấy dữ liệu từ các API bên ngoài, xử lý và lưu trữ dữ liệu.
// - `plantRecognition.ts`: Xử lý nhận diện cây trồng, bao gồm việc gửi ảnh tới Roboflow và nhận kết quả.
// - `userSettings.ts`: Quản lý cài đặt người dùng, bao gồm việc lưu trữ và truy xuất các tùy chọn cá nhân hóa.
// - `imageProcessing.ts`: Xử lý ảnh, bao gồm việc chuyển đổi định dạng, nén ảnh, và các thao tác tiền xử lý khác.
// - `cameraUtils.ts`: Các hàm tiện ích liên quan đến camera, bao gồm việc khởi tạo, dừng, và xử lý các sự kiện liên quan đến camera.
// - Các file này có thể được thiết kế để xử lý các tác vụ phức tạp và tương tác với các dịch vụ bên ngoài, do đó cũng cần được test kỹ lưỡng.
// - Ngoài ra, các file liên quan đến giao diện người dùng như `App.tsx`, `Header.tsx`, và các component khác cũng có thể trở nên tinh vi khi chúng quản lý nhiều trạng thái và tương tác với người dùng.


// Đó là file `App.tsx`, vì nó là điểm khởi đầu của ứng dụng và quản lý các trạng thái toàn cục, bao gồm cả việc khởi tạo camera và xử lý các sự kiện toàn cục.
// - File này có thể được mở rộng để quản lý các chức năng khác như xử lý ảnh, nhận diện cây trồng, và tương tác với các API bên ngoài.
// - Ngoài ra, các file liên quan đến giao diện người dùng như `Header.tsx` và các component khác cũng có thể trở nên tinh vi khi chúng quản lý nhiều trạng thái và tương tác với người dùng.


// - Trong dự án TE4GRI , ngoài file code app.tsx thì còn file nào sẽ có tiềm năng lớn để đạt độ tinh vi và phức tạp như scan.tsx ?
// - Trong dự án TE4GRI, ngoài file `scan.tsx`, các file có tiềm năng lớn để đạt độ tinh vi và phức tạp tương tự có thể bao gồm:
// - `plantRecognition.tsx`: Quản lý việc nhận diện cây trồng, bao gồm việc gửi ảnh tới Roboflow và nhận kết quả.
// - `dataService.tsx`: Quản lý việc lấy dữ liệu từ các API bên ngoài, xử lý và lưu trữ dữ liệu.
// - `userSettings.tsx`: Quản lý cài đặt người dùng, bao gồm việc lưu trữ và truy xuất các tùy chọn cá nhân hóa.
// - `imageProcessing.tsx`: Xử lý ảnh, bao gồm việc chuyển đổi định dạng, nén ảnh, và các thao tác tiền xử lý khác.
// - `cameraUtils.tsx`: Các hàm tiện ích liên quan đến camera, bao gồm việc khởi tạo, dừng, và xử lý các sự kiện liên quan đến camera.
// - 

//Trong file code scan.tsx tinh vi này liệu có thứ gì liên quan đến CameraUtils.tsx ?
// - Trong file code `scan.tsx`, có một số phần liên quan đến việc quản lý camera, nhưng không có tệp riêng biệt `CameraUtils.tsx` được sử dụng.
// - Tuy nhiên, nếu bạn muốn tách các chức năng liên quan đến camera ra thành một tệp riêng biệt, bạn có thể tạo một tệp `CameraUtils.tsx` để quản lý các hàm tiện ích liên quan đến camera như khởi tạo, dừng, và xử lý các sự kiện liên quan đến camera.
// - Việc này sẽ giúp mã nguồn trở nên rõ ràng hơn và dễ bảo trì hơn, đặc biệt khi bạn cần mở rộng hoặc thay đổi các chức năng liên quan đến camera trong tương lai.
// Trong file code scan.tsx tinh vi này liệu có thứ gì liên quan đến PlantRecognition.tsx ?
// - Trong file code `scan.tsx`, có phần liên quan đến việc nhận diện cây trồng thông qua việc gửi ảnh đã chụp tới Roboflow và nhận kết quả.
// - Tuy nhiên, không có tệp riêng biệt `PlantRecognition.tsx` được sử dụng.
// - Nếu bạn muốn tách phần nhận diện cây trồng ra thành một tệp riêng biệt, bạn có thể tạo một tệp `PlantRecognition.tsx` để quản lý các hàm liên quan đến việc gửi ảnh tới Roboflow, nhận kết quả và xử lý chúng.
// - Việc này sẽ giúp mã nguồn trở nên rõ ràng hơn và dễ bảo trì hơn, đặc biệt khi bạn cần mở rộng hoặc thay đổi các chức năng liên quan đến nhận diện cây trồng trong tương lai.

// Trong file code scan.tsx tinh vi này liệu có thứ gì liên quan đến DataService.tsx ?
// - Trong file code `scan.tsx`, không có phần nào trực tiếp liên quan đến `DataService.tsx`.
// - Tuy nhiên, nếu bạn có một tệp `DataService.tsx` để quản lý việc lấy dữ liệu từ các API bên ngoài, bạn có thể sử dụng nó để gửi ảnh đã chụp tới Roboflow và nhận kết quả.
// - Việc này sẽ giúp tách biệt các chức năng liên quan đến quản lý dữ liệu và xử lý ảnh, làm cho mã nguồn trở nên rõ ràng hơn và dễ bảo trì hơn.
// - Trong tương lai , nếu bạn muốn mở rộng chức năng của ứng dụng để cho phép người dùng tùy chỉnh các cài đặt liên quan đến dữ liệu hoặc xử lý ảnh, bạn có thể sử dụng `DataService.tsx` để quản lý các tùy chọn này.
// - Việc này sẽ giúp bạn dễ dàng mở rộng hoặc thay đổi các chức năng liên quan đến dữ liệu và xử lý ảnh mà không cần thay đổi quá nhiều mã nguồn.



// Trong file code scan.tsx tinh vi này liệu có thứ gì liên quan đến UserSettings.tsx ?
// - Trong file code `scan.tsx`, không có phần nào trực tiếp liên quan đến `UserSettings.tsx`.
// - Tuy nhiên, nếu bạn có một tệp `UserSettings.tsx` để quản lý cài đặt người dùng, bạn có thể sử dụng nó để lưu trữ các tùy chọn cá nhân hóa liên quan đến việc nhận diện cây trồng hoặc xử lý ảnh.
// - Việc này sẽ giúp tách biệt các chức năng liên quan đến quản lý cài đặt người dùng và xử lý ảnh, làm cho mã nguồn trở nên rõ ràng hơn và dễ bảo trì hơn.
// - Trong tương lai, nếu bạn muốn mở rộng chức năng của ứng dụng để cho phép người dùng tùy chỉnh các cài đặt liên quan đến camera, nhận diện cây trồng, hoặc xử lý ảnh, bạn có thể sử dụng `UserSettings.tsx` để quản lý các tùy chọn này 



//Tôi tưởng  nhận diện cây trồng là công việc của phạm trù computer vision phức tạp  chứ đâu có liên quan đến những thứ thiên về phần mềm như dự án code này ?
// - Đúng vậy, nhận diện cây trồng là một phần của computer vision, nhưng trong ngữ cảnh của dự án TE4GRI, việc này được thực hiện thông qua việc gửi ảnh đã chụp tới Roboflow, một dịch vụ bên ngoài chuyên về computer vision.
// - Trong file code `scan.tsx`, bạn chỉ cần quản lý việc chụp ảnh, gửi ảnh tới Roboflow và nhận kết quả.
// - Tuy nhiên, nếu bạn muốn mở rộng chức năng nhận diện cây trồng, bạn có thể tạo một tệp riêng biệt `PlantRecognition.tsx` để quản lý các hàm liên quan đến việc gửi ảnh tới Roboflow, nhận kết quả và xử lý chúng.
// Thế tại sao trong roboflow không tạo 1 workflow để trước khi dùng object detection sẽ tự động nhận diện cây trồng (classification ) ?
// - Trong Roboflow, bạn có thể tạo các workflow phức tạp để kết hợp nhiều tác vụ khác nhau như nhận diện cây trồng (classification) và phát hiện đối tượng (object detection).
// - Tuy nhiên, trong ngữ cảnh của dự án TE4GRI, việc tách biệt các tác vụ này có thể giúp mã nguồn trở nên rõ ràng hơn và dễ bảo trì hơn.
// - Bạn có thể tạo một workflow trong Roboflow để nhận diện cây trồng trước khi thực hiện phát hiện đối tượng, nhưng trong file code `scan.tsx`, bạn chỉ cần quản lý việc chụp ảnh, gửi ảnh tới Roboflow và nhận kết quả.
// - Việc này sẽ giúp bạn dễ dàng mở rộng hoặc thay đổi các chức năng liên quan đến nhận diện cây trồng và phát hiện đối tượng trong tương lai mà không cần thay đổi quá nhiều mã nguồn.




// Có phải sau tất cả scan.tsx và cả app.tsx là 2 file code quan trọng nhất trong dự án TE4GRI này không ?
// - Đúng vậy, trong dự án TE4GRI, `scan.tsx` và `app.tsx` là hai file code quan trọng nhất.
// Vì sao ? Hãy mổ xẻ và giải thích mọi thứ tường tận và chuyên sâu nhất ?
// - `scan.tsx` là nơi quản lý chức năng nhận diện cây trồng thông qua camera, bao gồm việc chụp ảnh, gửi ảnh tới Roboflow và nhận kết quả.
// - Nó xử lý các trạng thái khác nhau của ứng dụng như hiển thị camera preview, ảnh đã chụp, lỗi camera, v.v.
// - Nó cũng quản lý việc chọn loại cây trồng và hiển thị kết quả nhận diện, cung cấp trải nghiệm người dùng tương tác.
// - `app.tsx` là điểm khởi đầu của ứng dụng, nơi quản lý các trạng thái toàn cục và cấu hình ban đầu.
// - Nó có thể bao gồm việc khởi tạo camera, quản lý các component con và xử lý các sự kiện toàn cục.
// - Nó cũng có thể quản lý các cài đặt người dùng và các tùy chọn cá nhân hóa khác.
// - Cả hai file này đều có vai trò quan trọng trong việc cung cấp chức năng chính của ứng dụng và đảm bảo rằng người dùng có thể nhận diện cây trồng một cách dễ dàng và hiệu quả.



//CÓ phải sau tất cả thì scan.tsx hay app.tsx hay toàn cục cả folder source code tổng hiện tại này của TE4GRI thì cũng chỉ mới dừng ở mức Frontend ?
// - Đúng vậy, hiện tại toàn bộ mã nguồn trong folder `src` của dự án TE4GRI chủ yếu tập trung vào phần Frontend.
// - Nó bao gồm việc quản lý giao diện người dùng, tương tác với camera, xử lý ảnh và nhận diện cây trồng thông qua các API bên ngoài như Roboflow.
// - Tuy nhiên, để hoàn thiện ứng dụng, bạn có thể cần phát triển phần Backend để xử lý các tác vụ phức tạp hơn, lưu trữ dữ liệu, quản lý người dùng, v.v.
// - Phần Backend có thể bao gồm việc xây dựng API để quản lý dữ liệu cây trồng, lưu trữ kết quả nhận diện, và cung cấp các dịch vụ khác cho ứng dụng.
// - Việc phát triển phần Backend sẽ giúp ứng dụng trở nên hoàn chỉnh hơn, cung cấp trải nghiệm người dùng tốt hơn và mở rộng khả năng của ứng dụng trong tương lai.
// - Tuy nhiên, hiện tại, mã nguồn trong folder `src` đã cung cấp một nền tảng vững chắc cho việc phát triển ứng dụng Frontend, với các chức năng cơ bản như nhận diện cây trồng, quản lý camera và tương tác với người dùng.
// Nhưng tôi muốn phần frontend tham vọng này của tôi không chỉ dừng ở mức "chức năng cơ bản " như bạn nói ?
// - Nếu bạn muốn phần Frontend của dự án TE4GRI không chỉ dừng ở mức "chức năng cơ bản", bạn có thể xem xét các hướng phát triển sau đây để nâng cao tính năng và trải nghiệm người dùng:
// - Tích hợp các tính năng nâng cao như phân tích dữ liệu cây trồng, dự đoán năng suất, hoặc cung cấp thông tin về điều kiện thời tiết và đất đai.
// - Cải thiện giao diện người dùng với các thành phần tương tác hơn, như biểu đồ, bản đồ, hoặc các công cụ phân tích dữ liệu.
// - Thêm các tính năng xã hội, cho phép người dùng chia sẻ kết quả nhận diện cây trồng, thảo luận và trao đổi kinh nghiệm với nhau.



// Có 1 ý tưởng và câu hỏi cực kì tham vọng và tinh vi đó là chúng tôi không chỉ dừng lại ở chụp ảnh cây trồng và phát hiện sâu bệnh mà chúng tôi muốn mở rộng và bành trướng đến phạm trù của thế giới vệ tinh và những thứ liên quan thì sao ?
// - Đây là một ý tưởng rất tham vọng và có tiềm năng lớn để phát triển ứng dụng TE4GRI.
// - Để mở rộng ứng dụng từ việc chụp ảnh cây trồng và phát hiện sâu bệnh sang các lĩnh vực liên quan đến vệ tinh và dữ liệu không gian, bạn có thể xem xét các hướng phát triển sau:
// - Tích hợp dữ liệu vệ tinh: Sử dụng các dịch vụ cung cấp dữ liệu vệ tinh như Sentinel, Landsat hoặc các dịch vụ thương mại khác để cung cấp thông tin về điều kiện đất đai, độ ẩm, nhiệt độ, và các yếu tố môi trường khác ảnh hưởng đến cây trồng.
// - Phân tích dữ liệu không gian: Sử dụng các thuật toán phân tích dữ liệu không gian để nhận diện các mô hình phát triển của cây trồng, dự đoán năng suất, hoặc phát hiện sâu bệnh dựa trên các yếu tố môi trường.
// - Tích hợp với các dịch vụ GIS: Sử dụng các dịch vụ GIS (Geographic Information System) để hiển thị dữ liệu cây trồng trên bản đồ, cho phép người dùng xem và phân tích dữ liệu theo không gian.
// - Phát triển các công cụ phân tích dữ liệu: Cung cấp các công cụ cho người dùng để phân tích dữ liệu cây trồng, so sánh các khu vực khác nhau, và đưa ra quyết định dựa trên dữ liệu.
// - Tích hợp các công nghệ mới: Sử dụng các công nghệ mới như machine learning, AI, hoặc big data để cải thiện khả năng nhận diện cây trồng và phát hiện sâu bệnh, cũng như phân tích dữ liệu không gian.
// - Việc mở rộng ứng dụng sang các lĩnh vực liên quan đến vệ tinh và dữ liệu không gian sẽ giúp TE4GRI trở thành một công cụ mạnh mẽ hơn trong việc quản lý nông nghiệp thông minh, cung cấp thông tin chi tiết và hỗ trợ người dùng trong việc ra quyết định dựa trên dữ liệu.
// - Tuy nhiên, việc này cũng đòi hỏi bạn phải có kiến thức về các công nghệ và dịch vụ liên quan đến vệ tinh, dữ liệu không gian, và phân tích dữ liệu lớn.

// Quan trọng là nếu như thế thì TE4GRI của hiện tại sẽ biến chất hoàn toàn vì scan.tsx hay app.tsx không còn giá trị của nó ??
// - Đúng vậy, nếu bạn mở rộng TE4GRI sang các lĩnh vực liên quan đến vệ tinh và dữ liệu không gian, thì cấu trúc và chức năng của ứng dụng sẽ thay đổi đáng kể.
// - Các file như `scan.tsx` và `app.tsx` có thể không còn phù hợp với mục tiêu mới của ứng dụng.
// - Bạn sẽ cần thiết kế lại các thành phần của ứng dụng để tích hợp các chức năng mới, chẳng hạn như:
// - Tạo các component mới để hiển thị dữ liệu vệ tinh, bản đồ, và các phân tích không gian.
// - Xây dựng các API để lấy dữ liệu từ các dịch vụ vệ tinh và GIS.


// Nhưng vì bọn tôi rất tinh vi và tham vọng nên bọn tôi nên tư duy và động não theo hướng thông minh và thiên tài nào để phát triển theo hướng vệ tinh và các lĩnh vực liên quan nhưng mọi thứ của TE4GRI hiện tại vẫn sẽ đảm bảo được kế thừa hoàn toàn và sâu sắc ?
// - Để phát triển TE4GRI theo hướng vệ tinh và các lĩnh vực liên quan mà vẫn kế thừa được các chức năng hiện tại, bạn có thể áp dụng các chiến lược sau đây:
// - Tách biệt các chức năng: Thiết kế lại cấu trúc mã nguồn để tách biệt các chức năng hiện tại (như chụp ảnh, nhận diện cây trồng) và các chức năng mới (như dữ liệu vệ tinh, phân tích không gian). Bạn có thể tạo các module hoặc component riêng biệt cho từng chức năng.
// - Sử dụng kiến trúc microservices: Nếu có thể, hãy xem xét việc xây dựng ứng dụng theo kiến trúc microservices, trong đó mỗi chức năng (như nhận diện cây trồng, dữ liệu vệ tinh) được triển khai như một dịch vụ riêng biệt. Điều này giúp dễ dàng mở rộng và bảo trì ứng dụng.
// - Tích hợp các API bên ngoài: Sử dụng các API từ các dịch vụ vệ tinh và GIS để lấy dữ liệu mà không cần phải xây dựng lại từ đầu. Điều này giúp tiết kiệm thời gian và công sức trong việc phát triển.


// Bọn tôi hiện có rất nhiều folder codebase rất lớn ngoài folder mẹ "[SOURCE] TE4GRI (official alpha)" này , ví dụ như codebase khổng lồ dành cho AI-service của TE4GRI như NLP/chatbot và những logic thuật toán tinh vi để chuyển đổi chuyên nghiệp và tinh vi từ computer vision qua cho NLP , thế thì tôi có nên gom cả "[SOURCE] TE4GRI (official alpha)" này và những folder codebase khác lại với nhau thành 1 codebase khổng lồ nhất ?
// - Việc gom tất cả các folder codebase lại với nhau thành một codebase khổng lồ có thể mang lại một số lợi ích, nhưng cũng có những thách thức cần cân nhắc:
// - Lợi ích:
// - Tích hợp dễ dàng: Bạn có thể dễ dàng tích hợp các chức năng từ các module khác nhau, chẳng hạn như kết hợp nhận diện cây trồng với NLP/chatbot để cung cấp trải nghiệm người dùng tốt hơn.
// - Quản lý mã nguồn tập trung: Việc quản lý mã nguồn trong một codebase duy nhất giúp dễ dàng theo dõi và bảo trì, đặc biệt khi các module có sự phụ thuộc lẫn nhau.
// - Tận dụng lại mã nguồn: Bạn có thể tận dụng lại các thành phần đã phát triển trong các module khác nhau, giảm thiểu việc viết lại mã.
// - Thách thức:
// - Quản lý phức tạp: Khi codebase trở nên lớn, việc quản lý và bảo trì mã nguồn có thể trở nên phức tạp hơn, đặc biệt khi có nhiều người làm việc cùng một lúc.
// - Tăng thời gian build và deploy: Một codebase lớn có thể làm tăng thời gian build và deploy, ảnh hưởng đến quy trình phát triển.
// - Khó khăn trong việc phân tách chức năng: Khi tất cả các chức năng được gom lại, có thể khó khăn hơn trong việc phân tách và phát triển các tính năng độc lập.
// - Để giải quyết những thách thức này, bạn có thể xem xét các giải pháp sau:
// - Sử dụng hệ thống quản lý mã nguồn phân tán (như Git) để quản lý các module khác nhau trong cùng một repository, nhưng vẫn giữ chúng tách biệt về mặt logic.
// - Sử dụng các công cụ build và deploy hiện đại để quản lý việc xây dựng và triển khai các module một cách hiệu quả.


 


// Scan.tsx - Phiên bản Hoàn Chỉnh và Tối Ưu Hóa Camera (Ngày 10/05/2025)
import React, { FC, useState, useEffect, useRef, useCallback } from "react";
import "../css/app.scss"; 
import { useNavigate } from "zmp-ui"; 
import * as _image from "static/cloudIMG"; 
import { AdvancedImage } from "@cloudinary/react"; 

import {
    requestCameraPermission,
    createCameraContext,
    FacingMode,
} from "zmp-sdk/apis";
// Interface cho đối tượng CameraContext trả về từ ZMP SDK
interface ZMACameraContext {
    start: () => Promise<void>;
    stop: () => Promise<void>;
    pause?: () => Promise<void>;
    resume?: () => Promise<void>;
    takePhoto: (options?: { quality?: 'low' | 'medium' | 'high' }) => Promise<{ tempFilePath?: string; base64Data?: string }>;
    flip?: () => Promise<void>;
    isUsing?: () => Promise<boolean>;
}
// Định nghĩa các loại cây
interface Plant {
    name: string;
    value: string; // API endpoint từ Roboflow (cách mới)
    icon?: any;
}
const plants: Plant[] = [
    { name: "Cây Lúa", value: "https://serverless.roboflow.com/-experimental-newphase-rice-detection-2/2?api_key=GlIzXgqHyKlL4WamnCY6", },
    { name: "Cây Ngô", value: "https://serverless.roboflow.com/cn-detection/7?api_key=GlIzXgqHyKlL4WamnCY6" },
];
// Enum cho các trạng thái của trang Scan
enum ScanState {
    CAMERA_PREVIEW,
    IMAGE_CAPTURED,
    PROCESSING,
    SHOWING_RESULT,
    CAMERA_ERROR,
}
const Scan: FC = () => {
    const navigate = useNavigate();
    // States
    const [scanState, setScanState] = useState<ScanState>(ScanState.CAMERA_PREVIEW);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
    const [selectedPlant, setSelectedPlant] = useState<Plant>(plants[0]);
    const [isPlantDropdownOpen, setIsPlantDropdownOpen] = useState<boolean>(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    // Bắt đầu với true để hiển thị "Đang khởi động..." ban đầu, sẽ được quản lý bởi logic camera
    const [isInitializingCamera, setIsInitializingCamera] = useState<boolean>(true);
    // Refs
    const cameraContextRef = useRef<ZMACameraContext | null>(null);
    const videoElementRef = useRef<HTMLVideoElement | null>(null); // Giữ lại ref gốc nếu cần
    const [videoNode, setVideoNode] = useState<HTMLVideoElement | null>(null); // State cho video node từ callback ref
    const isActuallyInitializingRef = useRef<boolean>(false); // Ref chống re-entry cho initializeCamera
    // Callback ref cho thẻ video
    const videoCallbackRef = useCallback((node: HTMLVideoElement | null) => {
        console.log("videoCallbackRef CALLED. Node:", node);
        if (node) {
            console.log("Video element đã được mount vào DOM. Node name:", node.nodeName);
            videoElementRef.current = node; // Đồng bộ với ref cũ nếu cần
            setVideoNode(node);         
        } else {
            console.log("Video element đã được unmount khỏi DOM hoặc node là null.");
            
            setVideoNode(null); // Quan trọng: Cập nhật state khi node là null
        }
    }, []); 
    // === QUẢN LÝ CAMERA VÀ PERMISSION ===
    const initializeCamera = useCallback(async () => {
        if (isActuallyInitializingRef.current) {
            console.warn("InitializeCamera: Tiến trình khởi tạo thực sự đang chạy. Bỏ qua.");
            return;
        }
        if (cameraContextRef.current && (await cameraContextRef.current.isUsing?.() === true)) {
            console.log("InitializeCamera: Camera context đã tồn tại và đang sử dụng.");
            setScanState(ScanState.CAMERA_PREVIEW); // Đảm bảo UI đúng
            setIsInitializingCamera(false);      // Tắt loading UI
            return;
        }
        if (!videoNode) {
            console.error("InitializeCamera: Video element (node) chưa sẵn sàng. useEffect sẽ thử lại khi videoNode có.");
            // Không set lỗi ngay, isInitializingCamera sẽ giữ UI loading.
            // useEffect sẽ gọi lại khi videoNode sẵn sàng.
            return;
        }
        console.log("InitializeCamera: Bắt đầu tiến trình khởi tạo thực sự với videoNode.");
        isActuallyInitializingRef.current = true;
        setIsInitializingCamera(true); // Đảm bảo loading UI hiển thị
        setCameraError(null);
        try {
            await requestCameraPermission({});
            console.log("Quyền truy cập camera đã được cấp.");
            const context = createCameraContext({
                videoElement: videoNode,
                mediaConstraints: {
                    facingMode: FacingMode.BACK,
                    audio: false,
                },
            });
            cameraContextRef.current = context as ZMACameraContext;
            await cameraContextRef.current.start();
            console.log("Camera preview đã bắt đầu thông qua CameraContext.");
            setScanState(ScanState.CAMERA_PREVIEW); // Đảm bảo đúng state
            //setIsInitializingCamera(false); // Sẽ được gọi trong finally
        } catch (error: any) {
            console.error("Lỗi nghiêm trọng khi khởi tạo camera:", error);
            const errorMessage = error.message || "Không thể khởi động camera. Vui lòng kiểm tra quyền và thử lại.";
            setCameraError(errorMessage);
            setScanState(ScanState.CAMERA_ERROR);
        } finally {
            setIsInitializingCamera(false); // Tắt loading UI
            isActuallyInitializingRef.current = false; // Đánh dấu kết thúc
            console.log("InitializeCamera: Tiến trình khởi tạo kết thúc.");
        }
    }, [videoNode, setIsInitializingCamera, setCameraError, setScanState]);
    useEffect(() => {
        console.log("useEffect camera init triggered. videoNode:", !!videoNode, "scanState:", scanState, "contextExists:", !!cameraContextRef.current, "isActuallyInitializing:", isActuallyInitializingRef.current);
        if (
            videoNode && // Chỉ gọi khi videoNode đã sẵn sàng
            scanState === ScanState.CAMERA_PREVIEW &&
            !cameraContextRef.current // Và chưa có context
        ) {
            console.log("useEffect: Điều kiện gọi initializeCamera được đáp ứng (videoNode is present).");
            initializeCamera();
        }
        // USESTATE Cleanup

        return () => {
            console.log("useEffect cleanup: Đảm bảo camera được dừng nếu cần.");
            if (cameraContextRef.current?.stop) {
                cameraContextRef.current.stop()
                    .then(() => console.log("Camera đã dừng thành công khi unmount/re-run useEffect."))
                    .catch(err => console.error("Lỗi khi dừng camera lúc unmount/re-run useEffect:", err));
            }
        };
    }, [videoNode, scanState, initializeCamera]); // Dependencies cho useEffect
    // === XỬ LÝ HÌNH ẢNH ===
    const getBase64fromFile = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const handleChooseImage = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (cameraContextRef.current?.isUsing && await cameraContextRef.current.isUsing()) {
            try {
                await cameraContextRef.current.stop();
                console.log("Camera đã dừng trước khi hiển thị ảnh từ thư viện.");
            } catch (err) {
                console.error("Lỗi khi dừng camera (chọn ảnh):", err);
            }
        }
        cameraContextRef.current = null; // Quan trọng để useEffect khởi tạo lại nếu cần
        try {
            const base64 = await getBase64fromFile(file);
            setCapturedImage(base64);
            setScanState(ScanState.IMAGE_CAPTURED);
            setIsInitializingCamera(false); // Đã chọn ảnh, không còn ở trạng thái khởi tạo camera nữa
            setCameraError(null);
        } catch (error) {
            console.error("Lỗi chuyển đổi file sang Base64:", error);
            alert("Không thể đọc được file ảnh đã chọn. Vui lòng thử lại với file khác.");
        }
    }, [getBase64fromFile]); // getBase64fromFile là stable nếu không dùng useCallback hoặc deps rỗng


    const handleCaptureImage = useCallback(async () => {
        if (scanState !== ScanState.CAMERA_PREVIEW || !cameraContextRef.current?.takePhoto || isInitializingCamera) {
            alert("Chức năng chụp ảnh chưa sẵn sàng, camera đang khởi tạo hoặc ở trạng thái không hợp lệ.");
            return;
        }
        console.log('Attempting to take photo...');
        try {
          // 051025_DEBUG : TRƯỜNG HỢP KHÔNG CÓ QUALITY (UNDONE)
            const photoResult = await cameraContextRef.current.takePhoto({ quality: 'high'});
            console.log("Raw photoResult object:", photoResult); // Log đối tượng photoResult gốc
            // Để an toàn hơn khi log, có thể dùng JSON.stringify nếu photoResult có thể là null/undefined
            console.log("Raw photoResult (stringified):", JSON.stringify(photoResult));
            console.log("[OLD] Photo result object:", JSON.stringify(photoResult));    // 5/10/2025 LOG TOÀN BỘ ĐỐI TƯỢNG KẾT QUẢ

            if (photoResult && photoResult.base64Data) {
              console.log("Photo captured successfully with base64Data.");
              setCapturedImage(`data:image/jpeg;base64,${photoResult.base64Data}`);
              setScanState(ScanState.IMAGE_CAPTURED);
              setCameraError(null);
          } else if (photoResult && photoResult.tempFilePath) {
              console.warn("Photo captured with tempFilePath, processing needed:", photoResult.tempFilePath);
              // Xử lý tempFilePath (nếu có thể và cần thiết)
              // Hiện tại, vẫn coi như lỗi nếu chỉ có tempFilePath mà không có base64Data cho luồng hiện tại
              // Hoặc có thể tạm hiển thị placeholder và báo người dùng
              alert("Ảnh đã được lưu tạm (tempFilePath). Tính năng xử lý đường dẫn tạm đang được xem xét.");
              // setCapturedImage("data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="); // Placeholder
              // Tạm coi đây là trường hợp không hợp lệ cho luồng mong muốn hiện tại
              throw new Error("Nhận được tempFilePath nhưng không có base64Data như kỳ vọng.");
          } else {
              console.error("Invalid photo result:", photoResult);
              throw new Error("Không nhận được dữ liệu ảnh hợp lệ sau khi chụp.");
          }
      } catch (error: any) {
          console.error("Lỗi khi chụp ảnh (trong catch block):", error);
          alert(`Không thể chụp ảnh: ${error.message}. Vui lòng thử lại.`);
          // Có thể không cần thay đổi scanState ở đây, hoặc đặt về một trạng thái lỗi cụ thể hơn
      }
  }, [scanState, isInitializingCamera]); // Dependencies giữ nguyên



    const handleConfirmImage = useCallback(async () => {
        if (!capturedImage) {
            alert("Không có ảnh để xác nhận hoặc chưa chọn loại cây.");
            return;
        }
        setScanState(ScanState.PROCESSING);
        setProcessedImageUrl(null);
        const roboflowApiUrl = `${selectedPlant.value}&format=image&labels=on&stroke=3`;
        try {
            console.log("Đang gửi ảnh tới Roboflow:", roboflowApiUrl);
            const imageToSend = capturedImage.startsWith('data:')
                ? capturedImage.substring(capturedImage.indexOf(',') + 1)
                : capturedImage;
            const response = await fetch(roboflowApiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: imageToSend,
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Lỗi API Roboflow:", response.status, errorText);
                throw new Error(`Lỗi từ Roboflow (${response.status}): ${errorText || 'Không có thông tin chi tiết'}`);
            }
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setProcessedImageUrl(imageUrl);
            setScanState(ScanState.SHOWING_RESULT);
        } catch (error: any) {
            console.error("Lỗi khi xử lý ảnh với Roboflow:", error);
            alert(`Lỗi khi gửi ảnh phân tích: ${error.message},xin hãy thử lại sau !`);
            setScanState(ScanState.IMAGE_CAPTURED);
        }
    }, [capturedImage, selectedPlant]);
    const handleRetakeOrRestartScan = useCallback(async () => {
        setCapturedImage(null);
        setProcessedImageUrl(null);
        setCameraError(null);
        if (cameraContextRef.current) {
            try {
                await cameraContextRef.current.stop();
                console.log("Camera đã dừng trước khi khởi tạo lại để chụp lại.");
            } catch (err) {
                console.error("Lỗi khi dừng camera lúc reset (chụp lại):", err);
            } finally {
                cameraContextRef.current = null;
            }
        }
        setScanState(ScanState.CAMERA_PREVIEW);
        setIsInitializingCamera(true); // Hiển thị loading UI ngay, useEffect sẽ lo phần còn lại
    }, [setScanState, setIsInitializingCamera]);
    const handleSelectPlant = useCallback((plant: Plant) => {
        setSelectedPlant(plant);
        setIsPlantDropdownOpen(false);
    }, []);
    // === RENDER COMPONENTS PHỤ ===
    const renderCameraError = () => (
        <div className="scan-area-content error-message">
            <p>{cameraError}</p>
            <button onClick={handleRetakeOrRestartScan} className="control-button retry-button">
                Thử lại Camera
            </button>
        </div>
    );
    // Hàm này sẽ render nội dung cho lớp phủ "Đang khởi tạo"
    const renderInitializingMessageOverlay = () => (
        <div className="initializing-message-overlay" style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)', // Nền mờ để thấy video nếu có
            zIndex: 10, // Nổi lên trên video và khung chụp
            color: 'white'
        }}>
            <p>Đang khởi động camera...</p>
            {/* Có thể thêm spinner ở đây nếu muốn */}
        </div>
    );
    
    // Hàm renderInitializingCamera gốc có thể không cần nữa, hoặc chỉ là một div đơn giản
    // nếu được gọi ở các trạng thái không phải CAMERA_PREVIEW
    const renderFallbackInitializing = () => (
         <div className="scan-area-content initializing-message">
            <p>Đang khởi động camera...</p>
            {/* Khung chụp có thể không cần ở đây nếu đây là màn hình loading chung */}
            <AdvancedImage cldImg={_image.khungChup} className="scan-overlay-frame" />
        </div>
    );
    // === JSX RENDERING CHÍNH (ĐÃ SỬA LỖI RENDER) ===
    const renderScanArea = () => {
        if (scanState === ScanState.CAMERA_ERROR) {
            return renderCameraError();
        }
        if (scanState === ScanState.CAMERA_PREVIEW) {
            return (
                <div className="scan-area-content camera-live-preview" style={{ position: 'relative' }}>
                    <video
                        ref={videoCallbackRef}
                        autoPlay
                        playsInline
                        muted
                        className="camera-video-element"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {/* Khung chụp nên là một lớp phủ riêng biệt */}
                    <AdvancedImage cldImg={_image.khungChup} className="scan-overlay-frame" 
                                 style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', zIndex: 5 }}/>
                    {/* Hiển thị loading overlay nếu isInitializingCamera là true */}
                    {isInitializingCamera && renderInitializingMessageOverlay()}
                </div>
            );
        }
        // Các trạng thái khác không phải là CAMERA_PREVIEW:
        // Nếu isInitializingCamera vẫn true (ví dụ: đang chuyển state nhưng có độ trễ)
        // thì hiển thị thông báo loading chung.
        if (isInitializingCamera && scanState !== ScanState.IMAGE_CAPTURED && scanState !== ScanState.SHOWING_RESULT) {
            return renderFallbackInitializing();
        }
        switch (scanState) {
            case ScanState.IMAGE_CAPTURED:
                return (
                    <div className="scan-area-content image-preview-container">
                        {capturedImage && <img src={capturedImage} alt="Ảnh đã chụp" className="captured-image-preview" />}
                        <AdvancedImage cldImg={_image.khungChup} className="scan-overlay-frame" />
                    </div>
                );
            case ScanState.PROCESSING:
                return (
                    <div className="scan-area-content processing-indicator">
                        <p>Đang phân tích hình ảnh... Vui lòng đợi trong giây lát.</p>
                        <AdvancedImage cldImg={_image.khungChup} className="scan-overlay-frame" />
                    </div>
                );
            case ScanState.SHOWING_RESULT:
                return (
                    <div className="scan-area-content result-display-container">
                        {processedImageUrl ? (
                            <img src={processedImageUrl} alt="Kết quả chẩn đoán" className="processed-image-display" />
                        ) : (
                            <p>Không có kết quả để hiển thị.</p>
                        )}
                        <AdvancedImage cldImg={_image.khungChup} className="scan-overlay-frame" />
                    </div>
                );
            default:
                console.error("Trạng thái scan không xác định:", scanState);
                return <div className="scan-area-content error-message">Có lỗi xảy ra. Vui lòng thử lại.</div>;
        }
    };
    // === CONTROLS RENDERING ===
    const renderControls = () => {
        // Không hiển thị controls khi camera đang khởi tạo (trừ khi đã có ảnh/kết quả) hoặc lỗi nặng
        if (isInitializingCamera && scanState !== ScanState.IMAGE_CAPTURED && scanState !== ScanState.SHOWING_RESULT && scanState !== ScanState.CAMERA_ERROR) {
             // Nếu đang ở CAMERA_PREVIEW và isInitializingCamera là true, controls vẫn có thể hiển thị bên dưới overlay
            if (scanState !== ScanState.CAMERA_PREVIEW) { // Chỉ ẩn nếu không phải là preview đang loading
                 return null;
            }
        }
        if (scanState === ScanState.CAMERA_ERROR && !cameraContextRef.current) return null; // Nút thử lại đã có trong renderCameraError
        if (scanState === ScanState.IMAGE_CAPTURED) {
            return (
                <div className="confirmation-controls">
                    <p className="confirmation-text">Xác nhận gửi ảnh này để chẩn đoán?</p>
                    <div className="buttons-row">
                        <button onClick={handleRetakeOrRestartScan} className="control-button icon-button cancel-button">
                            <AdvancedImage cldImg={_image.backArrowIcon} alt="Chụp lại" />
                        </button>
                        <button onClick={handleConfirmImage} className="control-button icon-button confirm-button" disabled={!capturedImage}>
                            <AdvancedImage cldImg={_image.tickIcon} alt="Xác nhận" />
                        </button>
                    </div>
                </div>
            );
        }
        if (scanState === ScanState.SHOWING_RESULT) {
            return (
                <div className="post-result-controls">
                    <p className="result-message-text">Để hiểu rõ hơn về chẩn đoán và giải pháp, xác nhận trò chuyện với TE4BOT?</p>
                    <div className="buttons-row">
                        <button onClick={handleRetakeOrRestartScan} className="control-button icon-button back-to-scan-button">
                            <AdvancedImage cldImg={_image.backArrowIcon} alt="Quét lại" />
                        </button>
                        <button onClick={() => navigate('/chatbot')} className="control-button icon-button to-chatbot-button">
                            <AdvancedImage cldImg={_image.tickIcon} alt="Đến Chatbot" /> 
                        </button>
                    </div>
                </div>
            );
        }
        if (scanState === ScanState.PROCESSING) {
            return null; // Hoặc <p>Đang xử lý...</p>
        }
        // Controls cho CAMERA_PREVIEW (sẽ hiển thị ngay cả khi có overlay "Đang khởi tạo...")
        return (
            <>
                <div className="main-controls-bar">
                    <button
                        className="control-button choose-image-button"
                        onClick={() => document.getElementById("file-input-gallery")?.click()}
                        aria-label="Chọn ảnh từ thư viện"
                    >
                        <AdvancedImage cldImg={_image.chooseImage} />
                    </button>
                    <input
                        type="file" id="file-input-gallery" style={{ display: "none" }}
                        accept="image/*" onChange={handleChooseImage}
                    />
                    <button
                        className="control-button scan-action-button"
                        onClick={handleCaptureImage}
                        disabled={scanState !== ScanState.CAMERA_PREVIEW || isInitializingCamera}
                        aria-label="Chụp ảnh"
                    >
                        <AdvancedImage cldImg={_image.scanButton} />
                    </button>
                    <div className="plant-selector-wrapper">
                        <button
                            className="control-button plant-selector-trigger"
                            onClick={() => setIsPlantDropdownOpen(prev => !prev)}
                            aria-haspopup="true" aria-expanded={isPlantDropdownOpen}
                        >
                            <span>{selectedPlant.name || "Chọn loại cây"}</span>
                            <span className={`dropdown-indicator ${isPlantDropdownOpen ? 'open' : ''}`} aria-hidden="true">▼</span>
                        </button>
                    </div>
                </div>
                {isPlantDropdownOpen && (
                    <div className="plant-dropdown-menu" role="listbox">
                        {plants.map(plant => (
                            <div
                                key={plant.value}
                                className={`plant-dropdown-item ${selectedPlant.value === plant.value ? 'selected' : ''}`}
                                onClick={() => handleSelectPlant(plant)}
                                role="option" aria-selected={selectedPlant.value === plant.value}
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectPlant(plant);}}
                            >
                                {plant.icon && <AdvancedImage cldImg={plant.icon} className="plant-icon" alt=""/>}
                                {plant.name}
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    };
    // === JSX CHÍNH CỦA COMPONENT ===
    return (
        <div className="App scan-page-container">
            <header className="page-header">
                <AdvancedImage cldImg={_image.logo} className="app-logo-small" alt="TE4GRI Logo"/>
                <div className="page-title">
                    <AdvancedImage cldImg={_image.cameraIcon} className="title-icon" alt=""/>
                    <h1>Chẩn đoán cây trồng</h1>
                </div>
            </header>
            <main className="scan-content-wrapper">
                <div className="scan-area-wrapper">
                    {renderScanArea()}
                    {/* Thông báo placeholder này có thể cần điều kiện isInitializingCamera nữa */}
                    {scanState === ScanState.CAMERA_PREVIEW && !cameraError && !isInitializingCamera && (
                        <p className="scan-area-placeholder-text">Hướng camera vào cây cần chẩn đoán và giữ ổn định.</p>
                    )}
                </div>
                <section className="controls-section" aria-label="Điều khiển quét và lựa chọn">
                    {renderControls()}
                </section>
            </main>
        </div>
    );
};
export default Scan;
