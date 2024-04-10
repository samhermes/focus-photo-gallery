<?php
/**
 * Plugin Name: Focus Photo Galleries
 * Plugin URI: https://github.com/samhermes/focus-photo-gallery
 * Description: Give your photos the stage they deserve.
 * Author: Sam Hermes
 * Author URI: https://samhermes.com
 * Version: 1.0.0
 *
 * @package focus
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue assets for frontend.
 *
 * @since 1.0.0
 */
function focus_enqueue_scripts() {
	wp_enqueue_script(
		'focus',
		plugins_url( 'dist/js/focus.js', __FILE__ ),
		array(),
		'1.0.1',
		true // Enqueue the script in the footer.
	);

	$focus_js = 'const focusOptions = { selector: ".focus-gallery, .wp-block-gallery, .wp-block-image:not(.wp-block-gallery .wp-block-image)" }; focus(focusOptions);';
	wp_add_inline_script( 'focus', $focus_js );

    wp_enqueue_style(
		'focus',
		plugins_url( 'dist/css/focus.css', __FILE__ ),
		array(),
        '1.0.1'
	);
}
add_action( 'wp_enqueue_scripts', 'focus_enqueue_scripts' );

/**
 * Set default for "Link to" setting to media file.
 *
 * @since 1.0.0
 */
function focus_set_default_gallery_link( $settings ) {
    $settings['defaultProps']['link'] = 'media';
    return $settings;
}
add_filter( 'media_view_settings', 'focus_set_default_gallery_link');