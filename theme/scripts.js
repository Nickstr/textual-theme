/* Defined in: "Textual.app -> Contents -> Resources -> JavaScript -> API -> core.js" */

var mappedSelectedUsers = new Array();

Textual.viewFinishedLoading = function()
{
    Textual.fadeInLoadingScreen(1.00, 0.95);

    setTimeout(function() {
        Textual.scrollToBottomOfView()
        createHoverEvents();
    }, 500);
}

Textual.viewFinishedReload = function()
{
    Textual.viewFinishedLoading();
}

Textual.newMessagePostedToView = function(line)
{
    var element = document.getElementById("line-" + line);

    createHoverEvents();
    updateNicknameAssociatedWithNewMessage(element);
}

Textual.nicknameSingleClicked = function(e)
{
    userNicknameSingleClickEvent(e);
}

function updateNicknameAssociatedWithNewMessage(e)
{
    /* We only want to target plain text messages. */
    var elementType = e.getAttribute("ltype");

    if (elementType == "privmsg" || elementType == "action") {
        /* Get the nickname information. */
        var senderSelector = e.querySelector(".sender");

        if (senderSelector) {
            /* Is this a mapped user? */
            var nickname = senderSelector.getAttribute("nickname");

            /* If mapped, toggle status on for new message. */
            if (mappedSelectedUsers.indexOf(nickname) > -1) {
                toggleSelectionStatusForNicknameInsideElement(senderSelector);
            }
        }
    }
}

function toggleSelectionStatusForNicknameInsideElement(e)
{
    /* e is nested as the .sender so we have to go three parents
     up in order to reach the parent div that owns it. */
    var parentSelector = e.parentNode.parentNode.parentNode;

    parentSelector.classList.toggle("selectedUser");
}

function userNicknameSingleClickEvent(e)
{
    /* This is called when the .sender is clicked. */
    var nickname = e.getAttribute("nickname");

    /* Toggle mapped status for nickname. */
    var mappedIndex = mappedSelectedUsers.indexOf(nickname);

    if (mappedIndex == -1) {
        mappedSelectedUsers.push(nickname);
    } else {
        mappedSelectedUsers.splice(mappedIndex, 1);
    }

    /* Gather basic information. */
    var documentBody = document.getElementById("body_home");

    var allLines = documentBody.querySelectorAll('div[ltype="privmsg"], div[ltype="action"]');

    /* Update all elements of the DOM matching conditions. */
    for (var i = 0, len = allLines.length; i < len; i++) {
        var sender = allLines[i].querySelectorAll(".sender");

        if (sender.length > 0) {
            if (sender[0].getAttribute("nickname") === nickname) {
                toggleSelectionStatusForNicknameInsideElement(sender[0]);
            }
        }
    }
}

function createHoverEvents() {
    var documentBody = document.getElementById("body_home");
    var users = documentBody.getElementsByClassName('sender');
    var inlineUsers = documentBody.getElementsByClassName('inline_nickname');

    Array.prototype.forEach.call(users, function (user) {
        user.addEventListener("mouseover", emphasizeUserMessages);
        user.addEventListener("mouseout", normalizeUserMessages);
    });

    Array.prototype.forEach.call(inlineUsers, function (user) {
        user.addEventListener("mouseover", emphasizeUserMessages);
        user.addEventListener("mouseout", normalizeUserMessages);
    });
}

function emphasizeUserMessages(e) {
    var messages = getAllElementsWithAttribute('nickname', e.srcElement.getAttribute('nickname'));

    Array.prototype.forEach.call(messages, function (message) {
        message.classList.add("sender--emphasize");
    });
}

function normalizeUserMessages(e) {
    var messages = getAllElementsWithAttribute('nickname', e.srcElement.getAttribute('nickname'));

    Array.prototype.forEach.call(messages, function (message) {
        message.classList.remove("sender--emphasize");
    });
}


function getAllElementsWithAttribute(attribute, value)
{
    var matchingElements = [];
    var allElements = document.getElementsByTagName('*');
    for (var i = 0, n = allElements.length; i < n; i++)
    {
        if (allElements[i].getAttribute(attribute) == value)
        {
            // Element exists with attribute. Add to array.
            matchingElements.push(allElements[i]);
        }
    }
    return matchingElements;
}
