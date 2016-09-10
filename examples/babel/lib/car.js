import Vehicle from './vehicle';

export default class Car extends Vehicle {
  honk() { throw 'not implemented'; }

  static handleIntersection(light, car) {
    switch(light) {
      case 'yellow':
        car.honk();
      case 'green':
        return car.go();
      case 'red':
        return car.stop();
    }

    return car.stop();
  }
};
