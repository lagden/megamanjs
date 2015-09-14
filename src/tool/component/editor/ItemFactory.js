"use strict";

Editor.ItemFactory = function()
{
}

Editor.ItemFactory.prototype.create = function(type, node)
{
    switch (type) {
        case 'checkpoint':
            return function(x, y, r) {
                let model = new THREE.Mesh(
                    new THREE.CircleGeometry(r, 16),
                    new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true})
                );

                let object = new Engine.Object();
                object.setModel(model);
                object.position.x = x;
                object.position.y = y;

                let item = new Editor.Item(object, node);
                item.type = type;
                return item;
            }
            break;

        case 'cameraConstraint':
            return function(constraint) {
                let w = constraint[1].x - constraint[0].x,
                    h = constraint[1].y - constraint[0].y,
                    x = constraint[0].x + w / 2,
                    y = constraint[0].y + h / 2;

                let model = new THREE.Mesh(
                    new THREE.PlaneGeometry(w || 1, h || 1, 1, 1),
                    new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true})
                );

                let object = new Engine.Object();
                object.setModel(model);
                object.position.x = x;
                object.position.y = y;

                let item = new Editor.Item(object, node);
                item.type = type;
                return item;
            }
            break;

        case 'cameraWindow':
            return function(win) {
                let w = win[1].x - win[0].x,
                    h = win[1].y - win[0].y,
                    x = win[0].x + w / 2,
                    y = win[0].y + h / 2;

                let model = new THREE.Mesh(
                    new THREE.PlaneGeometry(w || 1, h || 1, 1, 1),
                    new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true})
                );

                let object = new Engine.Object();
                object.setModel(model);
                object.position.x = x;
                object.position.y = y;

                let item = new Editor.Item(object, node);
                item.type = type;
                return item;
            }
            break;
    }

    throw new Error("Unknown type " + type);
}