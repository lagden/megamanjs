Game.objects.Weapon = function()
{
    Engine.Events.call(this);

    this.ammo = new Engine.logic.Energy(100);
    this.code = undefined;
    this.coolDown = 0;
    this.coolDownDelay = undefined;
    this.cost = 1;
    this.directions = [
        new THREE.Vector2(-1, 0),
        new THREE.Vector2(1, 0),
    ];
    this.projectiles = [];
    this.projectilesFired = [];
    this.projectilesIdle = [];
    this.ready = true;
    this.user = undefined;

    this._lastAmmoAmount = undefined;
}

Engine.Util.mixin(Game.objects.Weapon, Engine.Events);

Game.objects.Weapon.prototype.EVENT_AMMO_CHANGED = 'ammo-changed';
Game.objects.Weapon.prototype.EVENT_READY = 'ready';

Game.objects.Weapon.prototype.addProjectile = function(projectile)
{
    if (!(projectile instanceof Game.objects.Projectile)) {
        throw new TypeError('Invalid projectile');
    }
    this.projectiles.push(projectile);
    this.projectilesIdle.push(projectile);
    projectile.events.bind(projectile.EVENT_RECYCLE, function() {
        this.recycleProjectile(projectile);
    }.bind(this));
}

Game.objects.Weapon.prototype.emit = function(projectile)
{
    if (!(projectile instanceof Game.objects.Projectile)) {
        throw new TypeError('Invalid projectile');
    }

    var user = this.user,
        aim = user.aim.clone();
    aim.clamp(this.directions[0], this.directions[1]);

    // If not explicitly aiming, infer x direction from user.
    if (aim.x === 0 && aim.y === 0) {
        aim.x = user.direction.x;
    }

    projectile.velocity.copy(aim).setLength(projectile.speed);

    projectile.setEmitter(user, aim);
    projectile.timeStretch = user.timeStretch;

    var index = this.projectilesIdle.indexOf(projectile);
    if (index !== -1) {
        this.projectilesIdle.splice(index, 1);
        this.projectilesFired.push(projectile);
    }

    projectile.time = 0;
    user.world.addObject(projectile);
}

Game.objects.Weapon.prototype.fire = function()
{
    if (!this.ready) {
        return false;
    }

    if (this.projectiles.length > 0 && this.projectilesIdle.length === 0) {
        return false;
    }

    if (!this.ammo.infinite && this.cost > 0) {
        if (this.ammo.amount < this.cost) {
            return false;
        }
        this.ammo.amount -= this.cost;
        this.trigger(this.EVENT_AMMO_CHANGED, [this]);
    }

    if (this.coolDown > 0) {
        this.ready = false;
        this.coolDownDelay = this.coolDown;
    }

    return true;
}

Game.objects.Weapon.prototype.getProjectile = function()
{
    return this.projectilesIdle[0];
}

Game.objects.Weapon.prototype.recycleProjectile = function(projectile)
{
    var index = this.projectilesFired.indexOf(projectile);
    if (index !== -1) {
        this.projectilesFired.splice(index, 1);
        this.projectilesIdle.push(projectile);
        this.user.world.removeObject(projectile);
    }
}

Game.objects.Weapon.prototype.setCoolDown = function(duration)
{
    this.coolDown = duration;
}

Game.objects.Weapon.prototype.setUser = function(user)
{
    if (user instanceof Game.objects.Character !== true) {
        throw new TypeError('User not character');
    }
    if (user.weapon instanceof Game.traits.Weapon !== true) {
        throw new TypeError('User missing weapon trait');
    }
    this.user = user;
}

Game.objects.Weapon.prototype.timeShift = function(dt)
{
    if (this._lastAmmoAmount !== this.ammo.amount) {
        this.trigger(this.EVENT_AMMO_CHANGED);
        this._lastAmmoAmount = this.ammo.amount;
    }

    if (this.coolDownDelay !== undefined) {
        this.coolDownDelay -= dt;
        if (this.coolDownDelay <= 0) {
            this.ready = true;
            this.trigger(this.EVENT_READY);
            this.coolDownDelay = undefined;
        }
    }
}

Game.objects.weapons = {};
