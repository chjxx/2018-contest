!function(r){var e={};function t(n){if(e[n])return e[n].exports;var a=e[n]={i:n,l:!1,exports:{}};return r[n].call(a.exports,a,a.exports,t),a.l=!0,a.exports}t.m=r,t.c=e,t.d=function(r,e,n){t.o(r,e)||Object.defineProperty(r,e,{configurable:!1,enumerable:!0,get:n})},t.r=function(r){Object.defineProperty(r,"__esModule",{value:!0})},t.n=function(r){var e=r&&r.__esModule?function(){return r.default}:function(){return r};return t.d(e,"a",e),e},t.o=function(r,e){return Object.prototype.hasOwnProperty.call(r,e)},t.p="",t(t.s=3)}([function(r,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(r,e){var t=void 0;return r>e&&(t=r,r=e,e=t),Math.floor(Math.random()*(e-r+1)+r)}},function(r,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n,a=function(){return function(r,e){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r))return function(r,e){var t=[],n=!0,a=!1,o=void 0;try{for(var u,i=r[Symbol.iterator]();!(n=(u=i.next()).done)&&(t.push(u.value),!e||t.length!==e);n=!0);}catch(r){a=!0,o=r}finally{try{!n&&i.return&&i.return()}finally{if(a)throw o}}return t}(r,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),o=function(){function r(r,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(r,n.key,n)}}return function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}}(),u=t(0);(n=u)&&n.__esModule;var i=function(){function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"#game";!function(r,e){if(!(r instanceof e))throw new TypeError("Cannot call a class as a function")}(this,r),this.$container=document.querySelector(e),this.$currScore=this.$container.querySelector(".current .number"),this.$bestScore=this.$container.querySelector(".best .number"),this.$msgBoard=this.$container.querySelector(".board .msg"),this.$cardsBoard=this.$container.querySelector(".board .cardsBoard"),this.$cardTemp=this.$container.querySelector("#temp").content.children[0]}return o(r,[{key:"move",value:function(r,e){var t=a(e,2),n=t[0],o=t[1],u=/\b(card-row-\d+)\b/.exec(r.className)[1],i=/\b(card-col-\d+)\b/.exec(r.className)[1],c="card-row-"+n,l="card-col-"+o,s=r.className;s=(s=s.replace(u,c)).replace(i,l),r.className=s}},{key:"createCard",value:function(r,e){var t=a(r,2),n=t[0],o=t[1];this.$cardTemp.className="card card-row-"+n+" card-col-"+o+" card-num-"+e+" card-new",this.$cardTemp.innerText=e;var u=document.importNode(this.$cardTemp,!0);return u.cardNumber=e,u}},{key:"throwCards",value:function(){for(var r=arguments.length,e=Array(r),t=0;t<r;t++)e[t]=arguments[t];e.forEach(function(r){r.classList.add("card-merged")})}},{key:"insertOneCard",value:function(r,e){var t;return t=this.createCard(r,e),this.$cardsBoard.append(t),t}},{key:"showMsg",value:function(){this.$msgBoard.classList.add("msg_show")}},{key:"hideMsg",value:function(){this.$msgBoard.classList.remove("msg_show")}},{key:"clearThrownCard",value:function(){for(var r=this.$cardsBoard.children,e=r.length-1;e>=0;e--)r[e].classList.contains("card-merged")&&r[e].remove()}},{key:"deleteLabelNew",value:function(){Array.from(this.$cardsBoard.children).forEach(function(r){r.classList.contains("card-new")&&r.classList.remove("card-new")})}},{key:"clear",value:function(){this.$cardsBoard.innerHTML="",this.$currScore.innerText=0}},{key:"updateScore",value:function(r){var e=a(r,2),t=e[0],n=e[1];this.$currScore.innerText=t,n&&(this.$bestScore.innerText=n)}}]),r}();e.default=i},function(r,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(){return function(r,e){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r))return function(r,e){var t=[],n=!0,a=!1,o=void 0;try{for(var u,i=r[Symbol.iterator]();!(n=(u=i.next()).done)&&(t.push(u.value),!e||t.length!==e);n=!0);}catch(r){a=!0,o=r}finally{try{!n&&i.return&&i.return()}finally{if(a)throw o}}return t}(r,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),a=function(){function r(r,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(r,n.key,n)}}return function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}}();var o=function(){function r(){!function(r,e){if(!(r instanceof e))throw new TypeError("Cannot call a class as a function")}(this,r),this.data=[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],this.currScore=0,this.bestScore=0,this.rowLength=this.data.length,this.colLength=this.data[0].length}return a(r,[{key:"getCard",value:function(r){var e=n(r,2),t=e[0],a=e[1];return this.data[t][a]}},{key:"setCard",value:function(r,e){var t=n(r,2),a=t[0],o=t[1];this.data[a][o]=e}},{key:"hasCard",value:function(r){var e=n(r,2),t=e[0],a=e[1];return null!==this.data[t][a]}},{key:"moveCard",value:function(r,e){var t=n(r,2),a=t[0],o=t[1],u=n(e,2),i=u[0],c=u[1],l=this.data[a][o];this.data[a][o]=null,this.data[i][c]=l}},{key:"searchEmpty",value:function(){var r=[];return this.data.forEach(function(e,t){e.forEach(function(e,n){null===e&&r.push([t,n])})}),r}},{key:"balanceNum",value:function(){for(var r=[],e=this,t=arguments.length,n=Array(t),a=0;a<t;a++)n[a]=arguments[a];return n.forEach(function(t){r.push(e.getCard(t))}),r[0].cardNumber===r[1].cardNumber}},{key:"isNew",value:function(r){return this.getCard(r).classList.contains("card-new")}},{key:"updateScore",value:function(r){return this.currScore+=r,this.currScore<=this.bestScore?[this.currScore]:(this.bestScore=this.currScore,[this.currScore,this.bestScore])}},{key:"isBookOut",value:function(){return 0===this.searchEmpty().length}},{key:"deleteCards",value:function(){for(var r=this,e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];t.forEach(function(e){r.data[e[0]][e[1]]=null})}},{key:"clear",value:function(){var r=this;this.data.forEach(function(e,t){e.forEach(function(e,n){r.data[t][n]=null})}),this.currScore=0}}]),r}();e.default=o},function(r,e,t){"use strict";var n=function(){return function(r,e){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r))return function(r,e){var t=[],n=!0,a=!1,o=void 0;try{for(var u,i=r[Symbol.iterator]();!(n=(u=i.next()).done)&&(t.push(u.value),!e||t.length!==e);n=!0);}catch(r){a=!0,o=r}finally{try{!n&&i.return&&i.return()}finally{if(a)throw o}}return t}(r,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),a=function(){function r(r,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(r,n.key,n)}}return function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}}();t(5);var o=c(t(2)),u=c(t(1)),i=c(t(0));function c(r){return r&&r.__esModule?r:{default:r}}var l=new o.default,s=void 0;function f(r,e,t){var a=l.getCard(r);if(-1===["up","down","left","right"].indexOf(e))return!1;if(!l.hasCard(r))return!1;if(o(r,e))return!1;function o(r,e){var t=n(r,2),a=t[0],o=t[1];return"up"===e?0===a:"down"===e?3===a:"left"===e?0===o:3===o}!function(r,e,t){var a=null,u=void 0,i=function(r,e){var t=n(r,2),a=t[0],o=t[1],u=void 0;u="up"===e?function(){return[--a,o]}:"down"===e?function(){return[++a,o]}:"left"===e?function(){return[a,--o]}:function(){return[a,++o]};return u}(r,e);do{u=i(),l.hasCard(u)&&(a=u)}while(!o(u,e)&&!a);null!==a?t(!0,a):t(!1,u)}(r,e,function(o,u){o?function(r,t,o){if(!l.isNew(t)&&l.balanceNum(r,t)){var u=l.getCard(t),i=a.cardNumber;s.throwCards(a,u),s.move(a,[t[0]+1,t[1]+1]),l.deleteCards(r,t);var c=s.insertOneCard([t[0]+1,t[1]+1],2*i);l.setCard(t,c);var f=l.updateScore(2*i);s.updateScore(f),o(!0)}else if(!function(r,e,t){var a=n(r,2),o=a[0],u=a[1],i=n(e,2),c=i[0],l=i[1];return"up"===t?o===c+1:"down"===t?o===c-1:"left"===t?u===l+1:u===l-1}(r,t,e)){var d=void 0;d="up"===e?[t[0]+1,t[1]]:"down"===e?[t[0]-1,t[1]]:"left"===e?[t[0],t[1]+1]:[t[0],t[1]-1],l.moveCard(r,d),s.move(a,[d[0]+1,d[1]+1]),o(!0)}}(r,u,function(r){t(r)}):(s.move(a,[u[0]+1,u[1]+1]),l.moveCard(r,u),t(!0))})}new(function(){function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"#game";!function(r,e){if(!(r instanceof e))throw new TypeError("Cannot call a class as a function")}(this,r);var t=this;s=new u.default(e);var n=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"];document.body.addEventListener("keydown",function(r){if(-1!==n.indexOf(r.code)){s.clearThrownCard(),s.deleteLabelNew(),t[r.code]()&&t.randomInsertOneCard(),l.isBookOut()&&function(){for(var r=!1,e=0;e<l.rowLength;e++){for(var t=0;t<l.colLength;t++){var n=[];e-1>0&&n.push([e-1,t]),e+1<3&&n.push([e+1,t]),t-1>0&&n.push([e,t-1]),t+1<3&&n.push([e,t+1]);var a=!0,o=!1,u=void 0;try{for(var i,c=n[Symbol.iterator]();!(a=(i=c.next()).done);a=!0){var f=i.value;if(l.balanceNum([e,t],f)){r=!0;break}}}catch(r){o=!0,u=r}finally{try{!a&&c.return&&c.return()}finally{if(o)throw u}}if(r)break}if(r)break}r||s.showMsg()}(),r.preventDefault()}}),document.body.addEventListener("click",function(r){"restart"===r.target.className&&(r.target.parentElement.classList.contains("msg")&&s.hideMsg(),t.start())}),t.start()}return a(r,[{key:"ArrowUp",value:function(){for(var r=!1,e=0;e<l.colLength;e++)for(var t=0;t<l.rowLength;t++)f([t,e],"up",function(e){r=e});return r}},{key:"ArrowDown",value:function(){for(var r=!1,e=0;e<l.colLength;e++)for(var t=l.rowLength-1;t>=0;t--)f([t,e],"down",function(e){r=e});return r}},{key:"ArrowLeft",value:function(){for(var r=!1,e=0;e<l.rowLength;e++)for(var t=0;t<l.colLength;t++)f([e,t],"left",function(e){r=e});return r}},{key:"ArrowRight",value:function(){for(var r=!1,e=0;e<l.rowLength;e++)for(var t=l.colLength-1;t>=0;t--)f([e,t],"right",function(e){r=e});return r}},{key:"start",value:function(){s.clear(),l.clear();for(var r=0;r<2;r++)this.randomInsertOneCard()}},{key:"randomInsertOneCard",value:function(){var r=l.searchEmpty(),e=r[(0,i.default)(0,r.length-1)],t=4===(0,i.default)(1,8)?4:2,n=s.insertOneCard([e[0]+1,e[1]+1],t);l.setCard(e,n)}}]),r}())},,function(r,e){}]);
//# sourceMappingURL=index.js.map