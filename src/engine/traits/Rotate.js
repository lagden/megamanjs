import Trait from '../Trait';

class Rotate extends Trait {
    constructor() {
        super();
        this.NAME = 'rotate';
        this.speed = 1;
    }

    __timeshift(deltaTime, totalTime)
    {
        this._host.model.rotation.z += (this.speed * deltaTime);
    }
}

export default Rotate;
