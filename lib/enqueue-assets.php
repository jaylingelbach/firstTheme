<?php

function firstTheme_assets() {
	wp_enqueue_style('firstTheme-stylesheet', get_template_directory_uri() .
	'/dist/assets/css/bundle.css', array(), '1.0.0', 'all');
}
add_action('wp_enqueue_scripts', 'firstTheme_assets');

function firstTheme_admin_assets() {
	wp_enqueue_style('firstTheme-admin-stylesheet', get_template_directory_uri() .
	'/dist/assets/css/admin.css', array(), '1.0.0', 'all');
}
add_action('admin_enqueue_scripts', 'firstTheme_assets');