// Trong một file mới, ví dụ: pages/TestCameraRefPage.tsx
import React, { useCallback, useState, useEffect } from 'react';

const TestCameraRefPage: React.FC = () => {
    const [videoNode, setVideoNode] = useState<HTMLVideoElement | null>(null);

    const videoCallbackRef = useCallback((node: HTMLVideoElement | null) => {
        console.log('[TestCameraRefPage] videoCallbackRef CALLED. Node:', node);
        if (node) {
            console.log('[TestCameraRefPage] Video element IS VALID. Node name:', node.nodeName);
            node.id = "testVideoElement"; // Gán ID để dễ kiểm tra trong DOM inspector nếu cần
            setVideoNode(node);
        } else {
            console.log('[TestCameraRefPage] Video element IS NULL or detached.');
            setVideoNode(null);
        }
    }, []);

    useEffect(() => {
        if (videoNode) {
            console.log('[TestCameraRefPage] useEffect detected videoNode is ready:', videoNode);
            // Ở đây có thể thử gọi các API camera cơ bản nếu muốn test thêm,
            // nhưng mục tiêu chính là xem videoNode có được set không.
            // Ví dụ: videoNode.play().catch(e => console.error("Error playing video:", e));
        } else {
            console.log('[TestCameraRefPage] useEffect detected videoNode is NULL.');
        }
    }, [videoNode]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Test Camera Callback Ref</h1>
            <p>Checking if videoCallbackRef is triggered and sets the videoNode state.</p>
            <video
                ref={videoCallbackRef}
                width="300"
                height="200"
                autoPlay
                playsInline // Quan trọng cho iOS và một số trình duyệt
                muted     // Thường cần thiết để autoplay hoạt động
                controls  // Hiển thị controls để dễ tương tác nếu cần
                style={{ border: '2px solid green', backgroundColor: 'lightgray' }}
            >
                Trình duyệt của bạn không hỗ trợ thẻ video.
            </video>
            {videoNode ? (
                <p style={{ color: 'green' }}>SUCCESS: Video Element is ready! (ID: {videoNode.id})</p>
            ) : (
                <p style={{ color: 'red' }}>PENDING/FAIL: Video Element is NOT ready.</p>
            )}
            <p>Xem console logs để biết chi tiết.</p>
        </div>
    );
};

export default TestCameraRefPage;