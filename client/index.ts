import { socketAnnounceTie, socketAnnounceWinner, socketMakeMove, socketReset } from "./socket-client";

import $ from "jquery";

$(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("player");

  const buttons = $(".rps__button");
  const message = $(".rps__message");
  const image = $(".rps__image");
  const player = $(".rps__player");

  player.html(`Playing as ${name}`);

  if (!name) {
    buttons.remove();
    image.remove();
    message.html("No player selected");
    return;
  }

  buttons.click(function () {
    const move = $(this).data("action");
    socketMakeMove.emit({ player: { name }, move });
    buttons.prop("disabled", true);
    image.addClass(move);
  });

  socketAnnounceTie.on(() => {
    message.html("It's a Tie!");
    image.removeClass("loading");
  });

  socketAnnounceWinner.on((winner) => {
    message.html(`${winner.player.name} wins with ${winner.move}!`);
    image.removeClass("loading");
  });

  socketReset.on(() => {
    buttons.prop("disabled", false);
    image.removeClass();
    image.addClass("rps__image loading");
    message.html("");
  })
})
