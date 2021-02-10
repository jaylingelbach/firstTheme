<?php

function _themeName_assets() {
	wp_enqueue_style('_themeName-stylesheet', get_template_directory_uri() .
	'/dist/assets/css/bundle.css', array(), '1.0.0', 'all');

	wp_enqueue_script( '_themeName-scripts', get_template_directory_uri() . 
	'/dist/assets/js/bundle.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', '_themeName_assets');

function _themeName_admin_assets() {
	wp_enqueue_style('_themeName-admin-stylesheet', get_template_directory_uri() .
	'/dist/assets/css/admin.css', array(), '1.0.0', 'all');

	wp_enqueue_script('_themeName-admin-scripts', get_template_directory_uri() . 
	'/dist/assets/js/admin.js', array(), '1.0.0', true);
}

add_action('admin_enqueue_scripts', '_themeName_admin_assets');