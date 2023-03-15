<script>
  $(document).ready(function() {
    var maxRelatedPosts = 2;

    function parseRelatedPosts(data) {
      var currentPostLabels = $('.post-labels a')
        .map(function() {
          return $(this).text();
        })
        .get();

      if (currentPostLabels.length === 0) return;

      var relatedPosts = [];
      var entries = data.feed.entry;

      entries.forEach(function(entry) {
        var labels = entry.category.map(function(category) {
          return category.term;
        });

        var commonLabels = labels.filter(function(label) {
          return currentPostLabels.includes(label);
        });

        if (commonLabels.length > 0) {
          relatedPosts.push({
            title: entry.title.$t,
            url: entry.link.find(function(link) {
              return link.rel === 'alternate';
            }).href,
            commonLabels: commonLabels
          });
        }
      });

      relatedPosts = relatedPosts.slice(0, maxRelatedPosts);

      if (relatedPosts.length > 0) {
        var relatedPostsContainer = $('<div>');
        relatedPostsContainer.html('<h3>Entradas relacionadas</h3>');
        relatedPostsContainer.css('marginTop', '2rem');

        relatedPosts.forEach(function(post) {
          var postLink = $('<a>');
          postLink.attr('href', post.url);
          postLink.text(post.title);
          postLink.css({
            display: 'block',
            marginBottom: '1rem'
          });

          relatedPostsContainer.append(postLink);
        });

        var postBody = $('.post-body.entry-content');
        if (postBody.length > 0) {
          postBody.append(relatedPostsContainer);
        }
      }
    }

    $.ajax({
      url:
        '/feeds/posts/summary?alt=json&amp;max-results=100&amp;callback=?',
      dataType: 'json',
      success: parseRelatedPosts
    });
  });
</script>
