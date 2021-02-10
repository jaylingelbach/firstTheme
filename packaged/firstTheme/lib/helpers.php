<?php

function firstTheme_post_meta() {
    echo 'Posted on ';
    echo '<a href="'. esc_url(get_permalink()) . '">';
    echo '<time datetime="' . esc_attr(get_the_date('c')) . '">' . esc_html(get_the_date()) . '</time>';
    echo '</a>';
    echo ' By <a href="' . esc_url(get_author_posts_url(get_the_author_meta('ID') )) .'">' . 
    esc_html(get_the_author()) . '</a>';
    
}

function firstTheme_readmore_link(){
    echo '<a href="' . esc_url(get_permalink()) . '" title="' . the_title_attribute(['echo' => false]) . '">'; 
    echo 'Read more <span class="u-screen-reader-text">About ' . get_the_title() . '</span>';
    echo '</a>';
}

?>