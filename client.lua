RegisterNetEvent("streammode:startStream")
AddEventHandler("streammode:startStream", function(config)
    -- ruft den Client-Export von screencapture auf
    exports.screencapture:captureStream({
        encoding = "webp",
        quality = 0.6,
        onFrame = function(frameData)
            -- frameData ist binär (Blob/Base64) → an Node-Server schicken
            PerformHttpRequest(config.serverEndpoint .. "?token=" .. config.uploadToken, function() end, "POST", frameData, {
                ["Content-Type"] = "application/octet-stream"
            })
        end
    })
end)

RegisterNetEvent("streammode:stopStream")
AddEventHandler("streammode:stopStream", function()
    exports.screencapture:stopCaptureStream()
end)
