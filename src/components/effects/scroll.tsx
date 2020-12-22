import { useEffect} from 'react';

import { from,  fromEvent, Subscription } from 'rxjs';
import { map, mergeMap} from 'rxjs/operators';

import { ScrollPosition } from 'interfaces/index';

export const useScrollPosition = (types: string[], callBack: (y: ScrollPosition) => void) => {
  useEffect(() => {
    const sub: Subscription = from(types)
      .pipe(
        mergeMap((eventType: string) => fromEvent(window, eventType)),
        map((event: Event): ScrollPosition => ({
          x: window.pageXOffset,
          y: window.pageYOffset,
          w: window.innerWidth,
          h: window.innerHeight
        }))
      )
      .subscribe((e: ScrollPosition) => callBack(e));

    return () => {
      sub.unsubscribe();
    };
  }, [types, callBack]);
};
