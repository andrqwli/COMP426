
export async function loadFeed() {
    let main = $('#main').empty();
    let newTweet = "<button class='newTweet'>New Tweet</button>";
    let heading = "<div class='heading'>" + newTweet + "</div>";
    main.append(heading);
    const result = await axios ({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true, 
    });
    for (let i = 0; i < 50; i++) {
        let tweet = result.data[i];
        main.append(makeTweet(tweet));
    }

}

function makeTweet(tweet) {
    let view = `<div class="tweet" id="${tweet.id}" tweet="${tweet.id}"></div>`;
    view += `<div class="tweetBody" id='body${tweet.id}' tweet="${tweet.id}">${tweet.body}</div>`;
    
    let likeButton = "";
    if (tweet.isLiked) {
        likeButton = `<button class="unlike" tweet="${tweet.id}" type="submit">${tweet.likeCount} Likes</button>`;
    } else {
        likeButton = `<button class="like" tweet="${tweet.id}" type="submit">${tweet.likeCount} Likes</button>`;
    }

    let retweetButton = `<button class="retweet" tweet="${tweet.id}">${tweet.retweetCount} Retweets</button>`;
    let replyButton = `<button class="reply" tweet="${tweet.id}">${tweet.replyCount} Replies</button>`;
    let buttonPanel = likeButton + retweetButton + replyButton;
    buttonPanel = "<div class='buttonPanel'>" + buttonPanel + "</div>";

    view += buttonPanel;
    view += `<div class="author">${tweet.author}</div>`;

    if (tweet.isMine) {
        let editButton = `<button class="edit" tweet="${tweet.id}">Edit</button>`;
        let deleteButton = `<button class="delete" tweet="${tweet.id}">Delete Tweet</button>`;
        let myPanel = "<div class='myPanel'>" + editButton + deleteButton + "</div>";
        view += myPanel;
    }
    view = `<div class='tweetView' id='tweetView${tweet.id}'>${view}</div>`;
    return view;
}

function reloadTweet(tweet) {
    let id = tweet.id;
    let oldTweet = $(`#tweetView${id}`);
    oldTweet.replaceWith(makeTweet(tweet));
}

async function getTweet(id) {
    const result = await axios ({
        method: 'get',
        url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${id}`,
        withCredentials: true
    });
    return result.data;
}

function createTweet() {
    let tweetForm = `
    <div id="editingTweet" class="tweetView">
        <div class="form">
            <h2>Compose Tweet</h2>
            <form>
                <textarea id="tweetText" maxlength="280"></textarea>
                <div class="new Panel">
                    <button class="submitTweet" type="submit">Post</button>
                    <button class="cancelTweet">Cancel</button>
                </div>
            </form>
        </div>
    </div>`;
    return tweetForm;
}

function handleCreateTweet(event) {
    event.preventDefault();
    let heading = $('.heading');
    heading.append(createTweet());
}

async function handleSubmitTweet(event) {
    event.preventDefault();
    let text = $('#tweetText').val();
    const result = await axios ({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            body: `${text}`
        }
    });
    loadFeed();
}

function handleCancelTweet(event) {
    event.preventDefault();
    $('#editingTweet').remove();
}

async function handleLike(event) {
    event.preventDefault();
    let tweetID = event.target.getAttribute('tweet');
    const result = await axios ({
        method: 'put',
        url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${tweetID}/like`,
        withCredentials: true
    });
    let tweet = await getTweet(tweetID);
    reloadTweet(tweet);
}

async function handleUnlike(event) {
    event.preventDefault()
    let tweetID = event.target.getAttribute('tweet');
    const result = await axios ({
        method: 'put',
        url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${tweetID}/unlike`,
        withCredentials: true
    });
    let tweet = await getTweet(tweetID);
    reloadTweet(tweet);
}

async function handleReply(event) {
    event.preventDefault();
    let tweetID = event.target.getAttribute('tweet');
    let div = $('#'+tweetID);
    div.empty();
    div.append(createReply(tweetID));
}

function createReply(tweetID) {
    let reply = `
    <div id="editingReply" class="tweetView">
        <div class="form">
            <h2>Compose Reply</h2>
            <form>
                <textarea id="replyText" maxlength="280"></textarea>
                <div class="reply Panel">
                    <button class="submitReply" tweet="${tweetID}" type="submit">Reply</button>
                    <button class="cancelReply">Cancel</button>
                </div>
            </form>
        </div>
    </div>`;
    return reply;
}

async function handleSubmitReply(event) {
    event.preventDefault();
    let tweetID = event.target.getAttribute('tweet');
    let text = $('#replyText').val();
    const result = await axios ({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            "type": "reply",
            "parent": tweetID,
            "body": `${text}`
        }
    })
    loadFeed();
}

function handleCancelReply(event) {
    event.preventDefault();
    $('#editingReply').remove();
}

function handleRetweet(event) {
    event.preventDefault();
    let tweetID = event.target.getAttribute('tweet');
    let div = $('#'+tweetID);
    div.empty();
    div.append(createRetweet(tweetID));
}

function createRetweet(tweetID) {
    let retweet = `
    <div id="editingRetweet" class="tweetView">
        <div class="form">
            <h2>Compose Retweet</h2>
            <form>
                <textarea id="retweetText" maxlength="280"></textarea>
                <div class="retweet Panel">
                    <button class="submitRetweet" tweet="${tweetID}" type="submit">Retweet</button>
                    <button class="cancelRetweet">Cancel</button>
                </div>
            </form>
        </div>
    </div>`;
    return retweet;
}

async function handleSubmitRetweet(event) {
    event.preventDefault();
    let tweetID = event.target.getAttribute('tweet');
    let text = $('#retweetText').val();
    const result = await axios ({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            "type": "retweet",
            "parent": tweetID,
            "body": `${text}`
        }
    })
    loadFeed();
}

function handleCancelRetweet(event) {
    event.preventDefault();
    $('#editingRetweet').remove();
}

async function handleDelete(event) {
    event.preventDefault();
    let tweetID = event.target.getAttribute('tweet');
    const result = await axios ({
        method: 'delete',
        url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${tweetID}`,
        withCredentials: true,
    })
    $(`#tweetView${tweetID}`).remove();
}

function handleEdit(event) {
    event.preventDefault();
    let tweetID = event.target.getAttribute('tweet');
    let div = $(`#body${tweetID}`);
    let text = div.val();
    div.empty();
    div.append(createEdit(text, tweetID));
}

function createEdit(text, tweetID) {
    let edit = `
    <div id="editingEdit" class="tweetView">
        <div class="form">
            <h2>Compose Edit</h2>
            <form>
                <textarea id="editText" maxlength="280">${text}</textarea>
                <div class="edit Panel">
                    <button class="submitEdit" tweet="${tweetID}" type="submit">Confirm</button>
                    <button class="cancelEdit">Cancel</button>
                </div>
            </form>
        </div>
    </div>`;
    return edit;
}

async function handleSubmitEdit(event) {
    event.preventDefault();
    let tweetID = event.target.getAttribute('tweet');
    let text = $('#editText').val();
    const result = await axios ({
        method: 'put',
        url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${tweetID}`,
        withCredentials: true,
        data: {
            "body": `${text}`
        }
    })
    loadFeed();
}

function handleCancelEdit(event) {
    event.preventDefault();
    $('#editingEdit').remove();
    $('.heading').append("<button class='newTweet'>New Tweet</button>");
}

export async function onLoad() {
    loadFeed();

    let main = $('#main');
    main.on('click', '.newTweet', handleCreateTweet);
    main.on('click', '.submitTweet', handleSubmitTweet);
    main.on('click', '.cancelTweet', handleCancelTweet);
    main.on('click', '.like', handleLike);
    main.on('click', '.unlike', handleUnlike);
    main.on('click', '.reply', handleReply)
    main.on('click', '.submitReply', handleSubmitReply);
    main.on('click', '.cancelReply', handleCancelReply);
    main.on('click', '.retweet', handleRetweet);
    main.on('click', '.submitRetweet', handleSubmitRetweet);
    main.on('click', '.cancelRetweet', handleCancelRetweet);
    main.on('click', '.delete', handleDelete);
    main.on('click', '.edit', handleEdit);
    main.on('click', '.submitEdit', handleSubmitEdit);
    main.on('click', '.cancelEdit', handleCancelEdit);
}

$(document).ready(onLoad());