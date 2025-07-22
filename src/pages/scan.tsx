
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
