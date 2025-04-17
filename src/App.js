import React, { useState, useRef } from "react";

export default function App() {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [overlayImage, setOverlayImage] = useState(
    "/TONY-WITHOUT-TRANSPARENT.png"
  );
  const [showOverlay, setShowOverlay] = useState(true);
  const canvasRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBackgroundImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setDragging(false);

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setBgPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleToggleTonyView = () => {
    setOverlayImage("/TONY-TRANSPARENT.png");
    setShowOverlay(true);
  };

  const handleToggleTraditional = () => {
    setOverlayImage("/TONY-WITHOUT-TRANSPARENT.png");
    setShowOverlay(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");

    const response = await fetch("https://formspree.io/f/moqgndko", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _replyto: "hprouty@avbuilder.com",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        image,
      }),
    });

    if (response.ok) setSubmitted(true);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "tonyview-preview.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="w-screen h-screen bg-gray-100 text-gray-800 flex flex-col items-center overflow-hidden">
      <div className="w-full text-center py-4 z-10 bg-white shadow-md">
        <h1 className="text-4xl font-bold mb-2">
          Envision TonyView In Your Space!
        </h1>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="px-4 py-2 border rounded bg-white"
          />
          <button
            onClick={handleToggleTraditional}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Traditional Blocked Corner
          </button>
          <button
            onClick={handleToggleTonyView}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            TonyView Open Corner
          </button>
          <button
            onClick={handleDownload}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Download Image
          </button>
        </div>
      </div>

      <div
        className="relative flex-1 w-full flex items-center justify-center overflow-hidden bg-white"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        ref={canvasRef}
      >
        <div className="relative w-full max-w-[800px] h-auto">
          {/* Background Image (z-index: 0) */}
          {backgroundImage && (
            <img
              src={backgroundImage}
              alt="Background"
              onMouseDown={handleMouseDown}
              style={{
                position: "absolute",
                top: bgPosition.y,
                left: bgPosition.x,
                width: "800px",
                height: "auto",
                userSelect: "none",
                cursor: "grab",
                zIndex: 0, // Background image on the lowest layer
              }}
              draggable={false}
            />
          )}

          {/* Overlay Image (z-index: 1 — always on top but moved below the contact section and buttons) */}
          {showOverlay && (
            <div
              style={{
                position: "absolute",
                top: "250px", // Move the overlay image below the contact section and buttons
                left: 0,
                width: "800px",
                height: "auto",
                pointerEvents: "none",
                zIndex: 1, // Overlay image on top layer
              }}
            >
              <img
                src={overlayImage}
                alt="Overlay"
                style={{
                  width: "100%",
                  height: "auto",
                }}
                draggable={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mb-6 z-10">
        <h2 className="text-xl font-semibold mb-4">Submit Your Design</h2>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleFormChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleFormChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Your Phone"
          value={formData.phone}
          onChange={handleFormChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <button
          onClick={handleFormSubmit}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Submit to TonyView
        </button>
        {submitted && (
          <p className="text-green-700 mt-2">Submitted successfully!</p>
        )}
      </div>
    </div>
  );
}
