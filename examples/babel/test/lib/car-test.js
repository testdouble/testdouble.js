import Car from '../../lib/car';

describe('Car', () => {
  let subject;

  beforeEach(() => {
    subject = td.object(Car);
  });

  describe('.handleIntersection', () => {
    describe('green light', () => {
      beforeEach(() => Car.handleIntersection('green', subject));

      it('should go', () => {
        td.verify(subject.go());
      });
    });

    describe('yellow light', () => {
      beforeEach(() => Car.handleIntersection('yellow', subject));

      it('should honk and go', () => {
        td.verify(subject.honk());
        td.verify(subject.go());
      });
    });

    describe('red light', () => {
      beforeEach(() => Car.handleIntersection('red', subject));

      it('should stop', () => {
        td.verify(subject.stop());
      });
    });

    describe('chartreuse?', () => {
      beforeEach(() => Car.handleIntersection('chartreuse', subject));

      it('should stop', () => {
        td.verify(subject.stop());
      });
    });
  })
})
