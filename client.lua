-- Client-Side Script für Streammode
RegisterNetEvent("streammode:startNuiStream")
AddEventHandler("streammode:startNuiStream", function(serverEndpoint, uploadToken, formField)
    -- NUI öffnen (optional Fokus)
    SetNuiFocus(true, true)

    -- NUI Nachricht an captureStream
    SendNUIMessage({
        action = "startCaptureStream",
        serverEndpoint = serverEndpoint,
        uploadToken = uploadToken,
        formField = formField
    })
end)

RegisterNetEvent("streammode:stopNuiStream")
AddEventHandler("streammode:stopNuiStream", function()
    SendNUIMessage({ action = "stopCaptureStream" })
    SetNuiFocus(false, false)
end)