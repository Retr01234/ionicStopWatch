import { Component } from '@angular/core';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  percent = 0;
  radius = 100;
  fullTime: any = '00:01:30';
  timer: any = false; // Defining Timer that we use in starttimer() method below
  progress: any = 0;
  minutes = 1;
  seconds: any = 30; // Set to any due to TS validation problems

  elapsed: any = {
    h: '00',
    m: '00',
    s: '00'
  };

  overallTimer: any = false;

  constructor(private insomnia: Insomnia, private nav: NavController) {
    this.insomnia.keepAwake().then(
      () => console.log('Success'),
      () => console.log('Error')
    );
  }

  redirectToList() {
     this.nav.navigateForward('list');
   }

  startTime() { // Defining startTimer() method as mentioned in the html file. When someone clicks the graphic, this method will be run
    if (this.timer) {
      clearInterval(this.timer); // If its currently a timer, then we clear the interval and start again
    }

    if (!this.overallTimer) { // If this overallTimer is false, then run progressTimer
      this.progressTimer();
      this.insomnia.keepAwake();
    }

    this.timer = false; // Each time will be reseted onto false
    this.percent = 0;
    this.progress = 0;

    const timeSplit = this.fullTime.split(':');
    this.minutes = timeSplit[1];
    this.seconds = timeSplit[2];

    // tslint:disable-next-line: radix
    const totalSeconds = Math.floor(this.minutes * 60) + parseInt(this.seconds);

    this.timer = setInterval(() => {
      if (this.percent === this.radius) {
        clearInterval(this.timer);
      }

      this.percent = Math.floor((this.progress / totalSeconds) * 100);
      this.progress++; // Add 1 to whatever the result of this outcome is
    }, 1000); // Adjust the percentage value each time
  }

  progressTimer() { // Defining the method mentioned above
    const countDownDate = new Date(); // The method countDownDate is set to new Date(); to get the current time/date.

    this.overallTimer = setInterval(() => { // Setting Overall Timer to setInterval
      const now = new Date().getTime(); // Defining the now variable
      // tslint:disable-next-line: max-line-length
      const distance = now - countDownDate.getTime(); // Variable distance is equal to variable now - countdowndate (distance between now and the countdown time)

      // tslint:disable-next-line: max-line-length
      this.elapsed.h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Finding the elpased time of h,m,s by doing a math calculation
      this.elapsed.m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.elapsed.s = Math.floor((distance % (1000 * 60)) / 1000);

      this.elapsed.h = this.pad(this.elapsed.h, 2); // We are taking the values above and basically padding them
      this.elapsed.m = this.pad(this.elapsed.m, 2);
      this.elapsed.s = this.pad(this.elapsed.s, 2);
    }, 1000); // 1 second = 1000 Milliseconds
  }

  pad(num, size) { // Creating a function called pad by using number & size
    let s = num + '';
    while (s.length < size) { s = '0' + s; }
    return s;
  }

  stopTime() {
    clearInterval(this.timer);
    clearInterval(this.overallTimer);
    this.overallTimer = false;
    this.timer = false;
    this.percent = 0;
    this.progress = 0;
    this.elapsed = {
      h: '00',
      m: '00',
      s: '00'
    };
    this.insomnia.allowSleepAgain();
  }
}
