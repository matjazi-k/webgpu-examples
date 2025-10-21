export function setupInput(cameraTarget, rotation) {
    document.addEventListener('keydown', function(event) {
        if (event.key === "Shift") cameraTarget[1] -= 0.1;
        if (event.key === " ") cameraTarget[1] += 0.1;
        if (event.key === "a") cameraTarget[0] -= 0.1;
        if (event.key === "d") cameraTarget[0] += 0.1;
        if (event.key === "s") cameraTarget[2] += 0.1;
        if (event.key === "w") cameraTarget[2] -= 0.1;
        if (event.key === "ArrowUp") rotation.speed += 0.01;
        if (event.key === "ArrowDown") rotation.speed -= 0.01;
        //console.log(cameraTarget, rotation.speed);
    });
}
