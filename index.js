(function () {
    "use strict";
    const SPRITE_WIDTH = 91;
    const SPRITE_HEIGHT = 61;

    var Animation = function (frame_set, delay) {
        this.count = 0;             // Counts the number of game cycles since the last frame change.
        this.delay = delay;         // The number of game cycles to wait until the next frame change.
        this.frame = 0;             // The value in the sprite sheet of the sprite image / tile to display.
        this.frame_index = 0;       // The frame's index in the current animation frame set.
        this.frame_set = frame_set; // The current animation frame set that holds sprite tile values.
    }

    Animation.prototype = {
        change: function (frame_set, delay = 15) {
            if (this.frame_set != frame_set) {                  // If the frame set is different:
                this.count = 0;                                 // Reset the count.
                this.delay = delay;                             // Set the delay.
                this.frame_index = 0;                           // Start at the first frame in the new frame set.
                this.frame_set = frame_set;                     // Set the new frame set.
                this.frame = this.frame_set[this.frame_index];  // Set the new frame value.
            }
        },

        update: function () {
            this.count++;                                       // Keep track of how many cycles have passed since the last frame change.
            if (this.count >= this.delay) {                     // If enough cycles have passed, we change the frame.
                this.count = 0;                                 // Reset the count.
                /* If the frame index is on the last value in the frame set, reset to 0.
                If the frame index is not on the last value, just add 1 to it. */
                this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
                this.frame = this.frame_set[this.frame_index];  // Change the current frame value.
            }
        },
    }

    var buffer, controller, display, loop, player, render, resize, sprite_sheet;

    buffer = document.createElement("canvas").getContext("2d");
    display = document.querySelector("canvas").getContext("2d");

    controller = {
        left: { active: false, state: false },
        right: { active: false, state: false },
        up: { active: false, state: false },

        keyUpDown: function (event) {
            /* Get the physical state of the key being pressed. true = down false = up*/
            var key_state = (event.type == "keydown") ? true : false;

            switch (event.keyCode) {
                case 37:// left key
                    if (controller.left.state != key_state) controller.left.active = key_state;
                    controller.left.state = key_state;
                    controller.right.state = !key_state;
                    break;
                case 38:// up key
                    if (controller.up.state != key_state) controller.up.active = key_state;
                    controller.up.state = key_state;
                    break;
                case 39:// right key
                    if (controller.right.state != key_state) controller.right.active = key_state;
                    controller.right.state = key_state;
                    controller.left.state = !key_state;
                    break;
            }
        },
    }

    player = {
        animation: new Animation(), // You don't need to setup Animation right away.
        jumping: true,
        height: 61, width: 91,
        x: 0, y: 0,
        x_velocity: 0, y_velocity: 0
    };

    /* The sprite sheet object holds the sprite sheet graphic and some animation frame
    sets. An animation frame set is just an array of frame values that correspond to
    each sprite image in the sprite sheet, just like a tile sheet and a tile map. */
    sprite_sheet = {
        // standing still - left, standing still - right, walk left, walk right
        frame_sets: [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10], [11, 12, 13]],
        image: new Image()
    };

    loop = function (time_stamp) {
        if (controller.up.active && !player.jumping) {
            controller.up.active = false;
            player.jumping = true;
            player.y_velocity -= 5.0;
        }
        // Walking left
        if (controller.left.active) {
            player.animation.change(sprite_sheet.frame_sets[2], 15);
            player.x_velocity -= 0.15;
        }
        // Walking Right
        else if (controller.right.active) {
            player.animation.change(sprite_sheet.frame_sets[3], 15);
            player.x_velocity += 0.15;
        }
        /* If you're just standing still, change the animation to standing still. */
        else if (!controller.left.active && !controller.right.active) {
            if (!controller.left.state) {
                player.animation.change(sprite_sheet.frame_sets[0], 20);
            }
            else if (!controller.right.state) {
                player.animation.change(sprite_sheet.frame_sets[1], 20);
            }
        }

        player.y_velocity += 0.25;
        player.x += player.x_velocity;
        player.y += player.y_velocity;
        player.x_velocity *= 0.9;
        player.y_velocity *= 0.9;

        if (player.y + player.height > buffer.canvas.height - 2) {
            player.jumping = false;
            player.y = buffer.canvas.height - 2 - player.height;
            player.y_velocity = 0;
        }
        if (player.x + player.width < 0) {
            player.x = buffer.canvas.width;
        } else if (player.x > buffer.canvas.width) {
            player.x = - player.width;
        }
        player.animation.update();
        render();
        window.requestAnimationFrame(loop);

    }

    render = function () {
        /* Draw the background. */
        buffer.fillStyle = "#ffffff";
        buffer.fillRect(0, 0, buffer.canvas.width, buffer.canvas.height);

        buffer.drawImage(sprite_sheet.image, player.animation.frame * SPRITE_WIDTH, 0, SPRITE_WIDTH, SPRITE_HEIGHT, Math.floor(player.x), Math.floor(player.y), SPRITE_WIDTH, SPRITE_HEIGHT);
        display.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, display.canvas.width, display.canvas.height);

    };

    resize = function () {
        display.canvas.width = document.documentElement.clientWidth;
        if (display.canvas.width > document.documentElement.clientHeight) {
            display.canvas.width = document.documentElement.clientHeight;
        }
        display.canvas.height = display.canvas.width;
        display.imageSmoothingEnabled = false;

    }


    window.addEventListener("resize", resize);
    window.addEventListener("keydown", controller.keyUpDown);
    window.addEventListener("keyup", controller.keyUpDown);

    resize();

    sprite_sheet.image.addEventListener("load", function (event) {  // When the load event fires, do this:
        window.requestAnimationFrame(loop);                         // Start the game loop.
    });

    sprite_sheet.image.src = "./imgs/ms_black_sheep.png";           // Start loading the image.
})();