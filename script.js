(function () {
  var chatUsers = [
    {
      id: 1,
      name: 'Кристина Яц',
      avatar: 'http://telegram.org.ru/uploads/posts/2017-05/1493644235_file_90206.jpg',
      profile: 'https://vk.com'
    },
    {
      id: 2,
      name: 'Константин Земцовский',
      avatar: 'https://pp.userapi.com/c625825/v625825785/56ebf/XU8K2z6G5h8.jpg',
      profile: 'https://vk.com/imkost'
    }
  ];

  var currentUser = chatUsers[0];

  var messages = [
  {
    id: 90,
    time: '22:09',
    userId: 1,
    text: 'What do I Treasure About My Child? (A Mom’s Answer)',
    checked: false
  }, {
    id: 91,
    time: '22:09',
    userId: 2,
    text: 'Nate wore his Spiderman costume tonight when we went out for dinner. His brother begged him not to, and even spent a few minutes trying to wrestle it off of him, but in the end Nate won the battle and we had Spiderman join us for dinner.',
    checked: false
  }, {
    id: 92,
    time: '00:19',
    userId: 1,
    text: 'What do I Treasure About My Child? (A Mom’s Answer)',
    checked: false
  }, {
    id: 93,
    time: '00:09',
    userId: 2,
    text: 'Nate wore his Spiderman costume tonight when we went out for dinner.',
    checked: false
  }, {
    id: 94,
    time: '01:09',
    userId: 1,
    text: 'Nate wore his Spiderman costume tonight when we went out for dinner. His brother begged him not to, and even spent a few minutes trying to wrestle it off of him, but in the end Nate won the battle and we had Spiderman join us for dinner.',
    checked: false
  },  {
      id: 95,
      time: '22:09',
      userId: 1,
      text: 'Привет. Привет.',
      checked: false
    }, {
      id: 96,
      time: '22:09',
      userId: 2,
      text: 'Привет. Как дела?',
      checked: false
    }, {
      id: 97,
      time: '12:09',
      userId: 1,
      text: 'Кинь ссылку.',
      checked: false
    }, {
      id: 98,
      time: '13:09',
      userId: 2,
      text: 'Привет. Нет, я сегодня занят',
      checked: false
    }, {
      id: 99,
      time: '12:09',
      userId: 1,
      text: 'Привет! Кинь ссылку',
      checked: false
    }, {
      id: 100,
      time: '13:09',
      userId: 2,
      text: 'Привет!! Да',
      checked: false
    }, {
      id: 101,
      time: '22:09',
      userId: 1,
      text: 'привет',
      checked: false
    }, {
      id: 102,
      time: '22:09',
      userId: 2,
      text: 'привет',
      checked: false
    }, {
      id: 103,
      time: '22:09',
      userId: 1,
      text: 'а скинь ссылку, которую ты вчера показывал',
      checked: false
    }, {
      id: 104,
      time: '22:09',
      userId: 2,
      previewInfo: {
        img: 'https://cdn-images-1.medium.com/max/2000/1*CB21wNJSmh4ZuMeONJ7D4g.jpeg',
        caption: 'Career Monogamy: The Awkward Tech Sin of Longevity - Nemhouse',
        url: 'https://nemhouse.com/',
        hostname: 'nemhouse.com'
      },
      checked: false
      }, {
        id: 105,
        time: '22:11',
        userId: 1,
        text: 'спасибо',
        checked: false
      }
  ];

  function initialization() {
    viewDialog();
  }

  function getTemplate(id) {
    var messageTmpHtml = document.getElementById(id).innerHTML.trim();
    var tmp = document.createElement('div');
    tmp.innerHTML = messageTmpHtml;
    return tmp.firstChild;
  }

  function viewDialog() {
    var dialogTmp = document.querySelector('.dialog');
    var avatarElem = dialogTmp.querySelector('.avatar');

    avatarElem.src = currentUser.avatar;
    avatarElem.alt = currentUser.name;
    dialogTmp.querySelector('.dialog__name').innerHTML = currentUser.name;
    dialogTmp.querySelector('.button-close').onclick = hideMessageActions;
    dialogTmp.querySelector('.button-sent').onclick = getCurrentMessage;
    dialogTmp.querySelector('.input').onkeyup = keyUpHandler;
    document.body.appendChild(dialogTmp);

    for(var i = messages.length - 11; i < messages.length; i++) {
      var message = messages[i];
      viewMessage(message, getUser(chatUsers, messages[i].userId));
    }
  }

  function viewMessage(message, user, insert) {
    var messageTmp = getTemplate('message');
    var avatarElem = messageTmp.querySelector('.avatar');
    var nameElem = messageTmp.querySelector('.head__name');

    messageTmp.setAttribute('data-id', message.id);
    avatarElem.src = user.avatar;
    avatarElem.alt = user.name;
    nameElem.innerHTML = user.name;
    nameElem.href = user.profile;
    messageTmp.querySelector('.head__time').innerHTML = message.time;

    var messageContentTmp;

    if (message.previewInfo) {
      var previewInfo = message.previewInfo;

      messageContentTmp = getTemplate('message-preview');

      messageContentTmp.href = previewInfo.url;
      messageContentTmp.querySelector('.preview__img').style.backgroundImage = "url(" + previewInfo.img + ")";
      messageContentTmp.querySelector('.preview__text').innerHTML = previewInfo.hostname;
      messageContentTmp.querySelector('.preview__head').innerHTML = previewInfo.caption;

    } else {
      messageContentTmp = document.createElement('div')
      messageContentTmp.classList.add('content__text');
      messageContentTmp.innerHTML = message.text;
    }

    messageTmp.onclick = toggleSelectedMessage;
    messageTmp.querySelector('.content').appendChild(messageContentTmp);

    if (insert) {
      document.querySelector('.dialog__body').insertBefore(messageTmp, document.querySelector('.dialog__body').firstChild);
    } else {
      document.querySelector('.dialog__body').appendChild(messageTmp);
    }
  }

  function createTotalText(number) {
    var titles = ['сообщение', 'сообщения', 'сообщений'];
    number = Math.abs(number);
    var cases = [2, 0, 1, 1, 1, 2];
    var title = titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
    return 'Выделено ' + number + ' ' + title;
}

  function showMessageActions(selectedMessage) {
    var dialogActionsElem = document.querySelector('.dialog__actions');
    var dialogInputElem = document.querySelector('.dialog__input');
    var dialogElem = document.querySelector('.dialog');

    dialogActionsElem.querySelector('.selected').innerHTML = createTotalText(selectedMessage);
    dialogActionsElem.classList.add('active');
    dialogInputElem.classList.remove('active');
    dialogElem.classList.add('areSomeChecked');
  }

  function hideMessageActions() {
    var dialogActionsElem = document.querySelector('.dialog__actions');
    var dialogInputElem = document.querySelector('.dialog__input');
    var dialogElem = document.querySelector('.dialog');

    messages.forEach(function (message) {
      message.checked = false;
    });

    document.querySelectorAll('.message').forEach(function (elem) {
      elem.classList.remove('message-check');
    });

    dialogActionsElem.classList.remove('active');
    dialogInputElem.classList.add('active');
    dialogElem.classList.remove('areSomeChecked');
  }

  function toggleSelectedMessage(event) {
     var messageId = this.getAttribute('data-id');
     var elem = this;

     messages.filter(function(message) {
        return message.id === parseInt(messageId);
     }).map(function (message) {
       elem.classList.toggle('message-check');
       message.checked = !message.checked;
     });

     var checkedMessage = messages.filter(function(message) {
       return message.checked;
     });

     var checkedMessageCount = checkedMessage.length;

     if (checkedMessageCount > 0) {
       showMessageActions(checkedMessageCount);
     } else {
       hideMessageActions();
     }
  }

  function createDate() {
    var date = new Date;
    var hours = date.getHours() <= 9 ? '0' + date.getHours() : date.getHours();
    var minutes = date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes();

    return (hours + ':' + minutes);
  }

  function keyUpHandler(event) {
    if(event.keyCode === 13) {
      getCurrentMessage();
    }
  }

  function getCurrentMessage() {
    var inputElem = document.querySelector('.input');
    var messageText = inputElem.value;

    inputElem.value = '';

    if (messageText != '') {
      var time = createDate();
      var id = 100 + messages.length - 1;
      var message = {
        id: id,
        time: time,
        userId: 1,
        text: messageText,
        checked: false
      };
      sendMessage(message);
      inputElem.focus();
    }
  }

  function sendMessage(message) {
    messages.push(message);
    viewMessage(message, chatUsers[1]);
    scrollToMessage(document.querySelector('.dialog__body').scrollHeight);
  }

  function scrollToMessage(scrollY) {
    window.scrollTo(0, scrollY);
  }

  function getUser(users, userId) {
    var user = users.filter(function(user) {
            return user.id === userId;
          });
    return user[0];
  }

  function loadMessages(messagesOnPage) {
    var messageCounter = messages.length - messagesOnPage - 1;

    if (messagesOnPage < messages.length) {
      var limit = Math.max(0, messageCounter - 1);

      for(var i = messageCounter; i >= limit; i--) {
        var message = messages[i];
        viewMessage(messages[i], getUser(chatUsers, messages[i].userId), true);
      }
    }
  }

  function fixedHeadAndFooter(scrolled) {
    var windowHeight = window.innerHeight;
    var dialogHeight = document.querySelector('.dialog').scrollHeight;
  	head.style.top = scrolled + 'px';
  	footer.style.bottom = dialogHeight - windowHeight - scrolled + 'px';
  }

  function fixedSupported() {
    var isSupported = null;

    if (document.createElement) {
      var elem = document.createElement("div");

      if (elem && elem.style) {
        elem.style.position = "fixed";
        elem.style.top = "10px";

        var body = document.body;

        if (body && body.appendChild && body.removeChild) {
          body.appendChild(elem);
          isSupported = elem.offsetTop === 10;
          body.removeChild(elem);
        }
      }
    }
    return isSupported;
  }

  window.onload = function() {
    var isFixedSupported = fixedSupported();

  	if (!isFixedSupported) {
  		document.body.className += ' no-fixed-supported';
  	}

    setTimeout(function() {
      var elem = document.querySelector('.dialog__body');
      elem.classList.remove('dialog__body-fixed');
      scrollToMessage(elem.scrollHeight);
    }, 0);
  }

  window.onscroll = function() {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    var heightElem = document.body.scrollHeight;
    var messagesOnPage = document.querySelectorAll('.message').length;
    var isFixedSupported = fixedSupported();

    if (scrolled < 100 && messagesOnPage < messages.length) {
      loadMessages(messagesOnPage);

      var newHeightElem = document.body.scrollHeight;
      var scrollY = newHeightElem - heightElem + scrolled;
      scrollToMessage(scrollY);
    }

    if (!isFixedSupported) {
      fixedHeadAndFooter(scrolled);
    }
  }

  initialization();

})();
