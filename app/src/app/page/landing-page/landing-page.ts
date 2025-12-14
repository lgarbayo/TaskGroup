import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './landing-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage implements AfterViewInit {
  @ViewChild('bgVideo') private bgVideo?: ElementRef<HTMLVideoElement>;

  protected readonly titleLetters = 'TaskGroup'.split('');
  protected readonly trackLetter = (index: number): number => index;

  ngAfterViewInit(): void {
    const video = this.bgVideo?.nativeElement;
    if (!video) {
      return;
    }

    const play = () => {
      video.play().catch(() => void 0);
    };

    if (video.readyState >= 2) {
      play();
    } else {
      video.addEventListener('canplay', play, { once: true });
    }
  }
}
