/* gen by new.py at 2021-02-11 12:14:08.427101 */
window.onload = async function onload() {

  // Object иконка on the screen, moves when the button is clicked.
  const girl = {
    // current path index
    path_index: -1,

    // current position
    position: [444, 504],

    // Array of all paths, each path is an array of points. Point is an
    // absolute coordinate in scene. Array creates an interpolated
    // path between two neigbour points. All coordinates are handmade tho.
    paths: [
      // path 0
      [ [408, 480], [384, 460], [352, 472] ],
      // path 1
      [ [314, 496], [276, 516] ],
      // path 2
      [ [234, 536], [188, 534] ],
      // path 3
      [ [148, 530], [108, 506] ],
      // path 4
      [ [86, 488], [84, 470], [120, 444] ],
      // path 5
      [ [110, 422], [118, 402], [142, 384] ],
      // path 6
      [ [212, 350] ],
      // path 7
      [ [238, 332], [236, 316], [176, 280] ],
      // path 8
      [ [118, 244], [124, 234], [138, 224] ],
      // path 9
      [ [162, 214], [152, 194], [162, 176], [184, 176], [200, 196] ],
      // Only first 10 point needed.
    ],

    // Moves girl to the next position w\ animated path.
    // Also locks move button until animation is over.
    async move() {
      // cannot move, the end is reached
      if (this.path_index + 1 >= this.paths.length) return;
      // lock move button
      const btn_to_univer = document.getElementsByClassName('block__btn-to-univer')[0];
      btn_to_univer.classList.add('disabled');
      // dom element in scene
      const dom = document.getElementsByClassName('girl')[0];
      // next path
      const path = this.paths[++this.path_index];
      // animation timings
      const delay = 0.05;
      let default_speed = 0.5;
      // go thru each point in path
      for (let p of path) {
        // subpath length
        const mag = Math.hypot(p[0] - this.position[0], p[1] - this.position[1]);
        // normalized speed
        const speed = default_speed / mag;
        const dx = (p[0] - this.position[0]) * speed;
        const dy = (p[1] - this.position[1]) * speed;
        // wait for animation done
        await new Promise((r) => {
          let counter = 0;
          const iid = setInterval(() => {
            if ((counter += speed) >= 1) {
              clearInterval(iid);
              return r();
            }
            // apply position
            this.position[0] += dx;
            this.position[1] += dy;
            dom.style.left = `${this.position[0]}px`;
            dom.style.top = `${this.position[1]}px`;
          }, delay * speed);
        });
        // apply end position (to reduce animation approximation error)
        this.position[0] = p[0];
        this.position[1] = p[1];
        dom.style.left = `${this.position[0]}px`;
        dom.style.top = `${this.position[1]}px`;
      }
      // enable button, moving is done
      btn_to_univer.classList.remove('disabled');
    },
  };


  // Friends block on screen (блок Друзья).
  const friends = {
    // Scrolls friends block horisontally.
    scroll(dx) {
      const icon_width = 60; // same as block__friends__icon (width + margin) in index.css
      const container_dom = document.getElementsByClassName('block__friends__icons-container')[0];
      container_dom.style.left = `${parseFloat(container_dom.style.left || 0) + icon_width * dx}px`;
    },
  };


  // rating window
  const rating = {
    // reloads data to frame
    refill_elements(data) {
      // sort rating before use
      const sorted_rating = data.rating.sort((a,b) => ~~b.points - ~~a.points);
      const elements = document.querySelectorAll('.rating__frame-element');
      for (let i = 0; i < elements.length; ++i) {
        // clear element
        const place = elements[i].querySelector('.rating__frame-element-place').querySelector('.rating__frame-text');
        const icon = elements[i].querySelector('.rating__frame-element-icon');
        const name = elements[i].querySelector('.rating__frame-element-name').querySelector('.rating__frame-text');
        const exp = elements[i].querySelector('.rating__frame-element-exp').querySelector('.rating__frame-text');
        place.innerText = `${i + 1}`;
        icon.classList.remove('male');
        icon.classList.remove('female');
        name.innerText = '###';
        exp.innerText = '###';
        name.classList.remove('is-friend');
        // fill from data (if exist)
        if (i >= sorted_rating.length) continue;
        const o = sorted_rating[i];
        name.innerText = `${o.name} ${o.lastName}`;
        exp.innerText = `${o.points}`;
        const is_friend = null != data.friends.find(e => e.id === o.id);
        if (is_friend) name.classList.add('is-friend');
        const img_class = ({ './male.png': 'male', './female.png': 'female' })[o.img];
        if (null != img_class) icon.classList.add(img_class);
      }
    },

    // shows window
    show() {
      // reload data from data.js
      this.refill_elements(data);
      // show
      const container = document.getElementsByClassName('rating-container')[0];
      const blank = document.getElementsByClassName('rating-blank')[0];
      const dom = document.getElementsByClassName('rating')[0];
      container.classList.remove('disabled');
      blank.classList.remove('hidden');
      dom.classList.remove('hidden');
    },

    // hides window
    hide() {
      const container = document.getElementsByClassName('rating-container')[0];
      const blank = document.getElementsByClassName('rating-blank')[0];
      const dom = document.getElementsByClassName('rating')[0];
      blank.classList.add('hidden');
      dom.classList.add('hidden');
      // transition not work w/o delay
      const animation_time = 1000; // see .rating "transition-duration"
      setTimeout(() => container.classList.add('disabled'), animation_time);
    },
  };


  // Draws scene and adds event listeners.
  (function draw_main() {
    // A little helper function used for creating a html container.
    function div(class_name, o=null) {
      // parses optional argument
      let children = [];
      let onclick = null;
      let text = null;
      if (o instanceof Array) children = o;
      else if ('function' === typeof o) onclick = o;
      else if (o instanceof Object && 'text' in o) text = o.text;
      // creates element
      const element = document.createElement('div');
      element.className = class_name;
      if (null != onclick) element.addEventListener('click', onclick);
      if (null != text) element.innerText = text;
      children.forEach(e => element.appendChild(e));
      return element;
    }

    // layout
    document.body.appendChild(
      div('main', [
        // game scene
        div('scene', [
          div('girl'),
          div('block', [
            div('block__friends', [
              div('btn block__friends__btn-arrow-left', () => friends.scroll(+1)),
              div('block__friends__icons', [
                div('block__friends__icons-container', [
                  // creates 10 icons
                  ...Array(10).fill().map((_,i) =>
                    div('block__friends__icon', [
                      // only 6 of it have an image
                      ...(i < 6 ? [ div('block__friends__icon-default') ] : []),
                      // first one have a plus sign
                      ...(i === 0 ? [ div('btn block__friends__icon-plus') ] : []),
                    ]),
                  ),
                ]),
              ]),
              div('btn block__friends__btn-arrow-right', () => friends.scroll(-1)),
            ]),
            div('btn block__btn-chat'),
            div('btn block__btn-to-univer', () => girl.move()),
            div('btn block__btn-mail'),
            div('btn block__btn-rating', () => rating.show()),
          ]),
        ]),
        // rating window
        div('rating-container disabled', [
          div('rating-blank hidden'),
          div('rating hidden', [
            div('btn rating__btn-close', () => rating.hide()),
            div('rating__title', [ div('rating__title-text') ]),
            div('rating__frame', [
              div('rating__frame-title', [
                div('rating__frame-title-place', [ div('rating__frame-text', { text: 'Место' }) ]),
                div('rating__frame-title-name', [ div('rating__frame-text', { text: 'Имя Фамилия' }) ]),
                div('rating__frame-title-exp', [ div('rating__frame-text', { text: 'Опыт' }) ]),
              ]),
              div('rating__frame-elements', [
                // elements number as in рейтинг.psd
                ...Array(7).fill().map(() =>
                  div('rating__frame-element', [
                    div('rating__frame-element-place', [ div('rating__frame-text', { text: '#' }) ]),
                    div('rating__frame-element-icon'),
                    div('rating__frame-element-name', [ div('rating__frame-text', { text: '####' }) ]),
                    div('rating__frame-element-exp', [ div('rating__frame-text', { text: '###' }) ]),
                  ])
                )
              ]),
            ]),
          ]),
        ]),
      ])
    );
  })();
}
