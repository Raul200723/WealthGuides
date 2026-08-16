(function () {
  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  var status = document.getElementById('search-status');
  if (!input || !results) return;

  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';
  input.value = initialQuery;

  var articles = [];
  fetch('/data/articles.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      articles = data.articles || [];
      if (initialQuery) runSearch(initialQuery);
    })
    .catch(function () {
      if (status) status.textContent = 'Search index unavailable right now.';
    });

  function runSearch(query) {
    var q = query.trim().toLowerCase();
    results.innerHTML = '';
    if (!q) {
      if (status) status.textContent = '';
      return;
    }
    var matches = articles.filter(function (a) {
      return (a.title + ' ' + a.description + ' ' + a.category).toLowerCase().indexOf(q) !== -1;
    });
    if (status) {
      status.textContent = matches.length + ' result' + (matches.length === 1 ? '' : 's') + ' for "' + query + '"';
    }
    matches.forEach(function (a) {
      var card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = '<div class="card-body">' +
        '<span class="card-eyebrow">' + a.category + '</span>' +
        '<h3 class="card-title"><a href="' + a.url + '">' + a.title + '</a></h3>' +
        '<p class="card-excerpt">' + a.description + '</p>' +
        '</div>';
      results.appendChild(card);
    });
  }

  var form = document.getElementById('search-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      runSearch(input.value);
      var url = new URL(window.location);
      url.searchParams.set('q', input.value);
      window.history.replaceState({}, '', url);
    });
  }
})();
