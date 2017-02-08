const Trait = require('../Trait');

class Translate extends Trait
{
    constructor()
    {
        super();
        this.NAME = 'translate';
        this.velocity = new THREE.Vector2(1, 1);
    }
    __timeshift(dt)
    {
        const pos = this._host.position;
        pos.x += this.velocity.x * dt;
        pos.y += this.velocity.y * dt;
    }
}

module.exports = Trait;
