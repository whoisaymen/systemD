interface BigBangProps {
	fillColor?: string
	strokeColor?: string
}

const LaMemoireTsx: React.FC<BigBangProps> = ({ fillColor, strokeColor }) => (
	<svg
		width="225"
		height="204"
		viewBox="0 0 225 204"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M106.32 148.087L106.32 35.5533C106.32 27.5931 115.169 22.8238 121.818 27.2001L207.308 83.467C213.312 87.4179 213.311 96.2223 207.308 100.173L121.818 156.44C115.169 160.816 106.32 156.047 106.32 148.087Z"
			fill="#1C1C1E"
		/>
		<path
			d="M17 148.087L17 35.5533C17 27.5931 25.8485 22.8238 32.4977 27.2001L117.988 83.467C123.991 87.4179 123.991 96.2223 117.988 100.173L32.4977 156.44C25.8485 160.816 17 156.047 17 148.087Z"
			fill="#1C1C1E"
		/>
		<path
			d="M160.503 149.842C156.598 149.842 153.092 149.202 149.985 147.923C146.879 146.606 144.438 144.724 142.663 142.278C140.888 139.795 140 136.841 140 133.417C140 130.181 140.555 127.227 141.664 124.555C142.774 121.846 144.371 119.513 146.457 117.556C148.587 115.599 151.161 114.094 154.179 113.041C157.241 111.987 160.68 111.46 164.497 111.46C168.447 111.46 171.953 112.119 175.015 113.436C178.121 114.715 180.562 116.578 182.337 119.024C184.112 121.47 185 124.423 185 127.885C185 131.121 184.445 134.094 183.336 136.803C182.226 139.475 180.606 141.789 178.476 143.746C176.391 145.703 173.817 147.208 170.754 148.261C167.737 149.315 164.32 149.842 160.503 149.842ZM160.769 139.964C162.278 139.964 163.565 139.55 164.63 138.722C165.74 137.857 166.649 136.747 167.359 135.392C168.114 134.038 168.669 132.589 169.024 131.046C169.379 129.466 169.556 127.979 169.556 126.587C169.556 125.421 169.357 124.461 168.957 123.708C168.602 122.918 168.025 122.335 167.226 121.959C166.472 121.545 165.473 121.338 164.231 121.338C162.722 121.338 161.413 121.771 160.303 122.636C159.238 123.464 158.328 124.555 157.574 125.91C156.864 127.264 156.331 128.732 155.976 130.312C155.621 131.855 155.444 133.323 155.444 134.715C155.444 135.844 155.621 136.803 155.976 137.594C156.376 138.384 156.975 138.986 157.774 139.4C158.572 139.776 159.571 139.964 160.769 139.964Z"
			fill={fillColor}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M148.843 150.697L148.814 150.685C145.266 149.18 142.366 146.978 140.235 144.041L140.222 144.023C138.04 140.969 137 137.387 137 133.417C137 129.835 137.615 126.487 138.891 123.411C140.159 120.316 141.999 117.625 144.405 115.368L144.428 115.347C146.889 113.086 149.827 111.382 153.19 110.208L153.203 110.204L153.203 110.204C156.63 109.025 160.406 108.46 164.497 108.46C168.771 108.46 172.685 109.172 176.179 110.671C179.73 112.137 182.632 114.323 184.765 117.262C186.965 120.292 188 123.886 188 127.885C188 131.47 187.384 134.834 186.112 137.94L186.106 137.954C184.832 141.023 182.963 143.695 180.517 145.945C178.088 148.22 175.139 149.925 171.737 151.096C168.348 152.278 164.59 152.842 160.503 152.842C156.269 152.842 152.366 152.148 148.843 150.697ZM178.476 143.746C180.606 141.789 182.226 139.475 183.336 136.803C184.445 134.094 185 131.121 185 127.885C185 124.423 184.112 121.47 182.337 119.024C180.562 116.578 178.121 114.715 175.015 113.436C171.953 112.119 168.447 111.46 164.497 111.46C160.68 111.46 157.241 111.987 154.179 113.041C151.161 114.094 148.587 115.599 146.457 117.556C144.371 119.513 142.774 121.846 141.664 124.555C140.555 127.227 140 130.181 140 133.417C140 136.841 140.888 139.795 142.663 142.278C144.438 144.724 146.879 146.606 149.985 147.923C153.092 149.202 156.598 149.842 160.503 149.842C164.32 149.842 167.737 149.315 170.754 148.261C173.817 147.208 176.391 145.703 178.476 143.746ZM167.359 135.392C166.649 136.747 165.74 137.857 164.63 138.722C163.565 139.55 162.278 139.964 160.769 139.964C159.571 139.964 158.572 139.776 157.774 139.4C156.975 138.986 156.376 138.384 155.976 137.594C155.621 136.803 155.444 135.844 155.444 134.715C155.444 133.323 155.621 131.855 155.976 130.312C156.331 128.732 156.864 127.264 157.574 125.91C158.328 124.555 159.238 123.464 160.303 122.636C161.413 121.771 162.722 121.338 164.231 121.338C165.473 121.338 166.472 121.545 167.226 121.959C168.025 122.335 168.602 122.918 168.957 123.708C169.357 124.461 169.556 125.421 169.556 126.587C169.556 127.979 169.379 129.466 169.024 131.046C168.669 132.589 168.114 134.038 167.359 135.392ZM160.213 127.337C160.796 126.299 161.449 125.545 162.144 125.005L162.148 125.001C162.691 124.578 163.339 124.338 164.231 124.338C165.178 124.338 165.624 124.502 165.783 124.589C165.837 124.618 165.892 124.646 165.948 124.673C166.113 124.75 166.165 124.814 166.221 124.938C166.248 124.998 166.276 125.057 166.307 125.115C166.408 125.304 166.556 125.739 166.556 126.587C166.556 127.724 166.411 128.985 166.098 130.381C165.805 131.651 165.351 132.832 164.739 133.933C164.726 133.955 164.714 133.977 164.702 134C164.174 135.008 163.531 135.775 162.787 136.355C162.311 136.725 161.694 136.964 160.769 136.964C159.916 136.964 159.397 136.835 159.104 136.709C158.907 136.598 158.783 136.471 158.685 136.298C158.558 135.986 158.444 135.486 158.444 134.715C158.444 133.577 158.589 132.337 158.9 130.985L158.903 130.97C159.201 129.644 159.641 128.437 160.213 127.337Z"
			fill={strokeColor}
		/>
		<path
			d="M95 176.989L102.564 131.131H116.653L117.691 149.196L117.938 160.939H117.987L121.942 149.127L128.468 131.131H144.485L136.921 176.989H126.886L129.506 161.078L131.879 146.625H131.78L120.36 176.989H111.709L109.633 147.112H109.534L107.655 161.078L105.035 176.989H95Z"
			fill={fillColor}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M92.7126 178.93C92.1426 178.259 91.8966 177.37 92.04 176.501L99.6036 130.643C99.8426 129.194 101.095 128.131 102.564 128.131H116.653C118.243 128.131 119.557 129.371 119.648 130.959L120.426 144.507L125.647 130.108C126.078 128.921 127.205 128.131 128.468 128.131H144.485C145.366 128.131 146.202 128.518 146.772 129.19C147.342 129.862 147.588 130.75 147.445 131.619L139.881 177.478C139.642 178.926 138.39 179.989 136.921 179.989H126.886C126.005 179.989 125.169 179.602 124.599 178.931C124.029 178.259 123.783 177.371 123.926 176.502L124.063 175.665L123.168 178.045C122.729 179.215 121.61 179.989 120.36 179.989H111.709C110.133 179.989 108.826 178.77 108.716 177.197L108.516 174.315L107.996 177.477C107.757 178.926 106.504 179.989 105.035 179.989H95C94.119 179.989 93.2826 179.602 92.7126 178.93ZM107.655 161.078L109.534 147.112H109.633L111.709 176.989H120.36L131.78 146.625H131.879L126.886 176.989H136.921L144.485 131.131H128.468L121.942 149.127L117.987 160.939H117.938L117.691 149.196L116.653 131.131H102.564L95 176.989H105.035L107.655 161.078Z"
			fill={strokeColor}
		/>
		<path
			d="M55 167.41L64.5219 130.23H99L96.5106 139.863H76.5332L75.3508 144.483H91.1584L88.9179 153.383H73.1103L71.9901 157.777H92.3409L89.8515 167.41H55ZM82.2588 118.062H94.7058L86.6153 127.47H76.2221L82.2588 118.062Z"
			fill={fillColor}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M52.6301 169.25C52.0618 168.518 51.8639 167.564 52.0938 166.666L61.6157 129.486C61.9557 128.159 63.1518 127.23 64.5219 127.23H73.2317C73.2704 126.747 73.4261 126.273 73.6972 125.85L79.734 116.442C80.2858 115.582 81.2372 115.062 82.2589 115.062H94.7058C95.8783 115.062 96.9433 115.746 97.4324 116.811C97.9214 117.877 97.7449 119.13 96.9804 120.019L90.7782 127.23H99C99.928 127.23 100.804 127.66 101.372 128.394C101.94 129.127 102.137 130.083 101.905 130.981L99.4152 140.614C99.073 141.938 97.8784 142.863 96.5106 142.863H93.6839C94.1288 143.557 94.2708 144.408 94.0677 145.215L91.8272 154.116C91.7684 154.349 91.683 154.571 91.5748 154.777H92.3409C93.2689 154.777 94.1446 155.207 94.7128 155.94C95.281 156.674 95.4776 157.629 95.2455 158.528L92.7561 168.161C92.4139 169.485 91.2193 170.41 89.8515 170.41H55C54.0732 170.41 53.1984 169.982 52.6301 169.25ZM73.1103 153.383H88.918L91.1584 144.483H75.3508L76.5333 139.863H96.5106L99 130.23H64.5219L55 167.41H89.8515L92.3409 157.777H71.9901L73.1103 153.383ZM94.7058 118.062H82.2589L76.2221 127.47H86.6153L94.7058 118.062Z"
			fill={strokeColor}
		/>
		<path
			d="M3 184.956L12.1708 106H29.2537L30.5125 137.104L30.8122 157.322H30.8721L35.6673 136.984L43.5794 106H63L53.8292 184.956H41.6613L44.8382 157.561L47.7153 132.678H47.5954L33.7493 184.956H23.2597L20.7423 133.515H20.6224L18.3447 157.561L15.1678 184.956H3Z"
			fill={fillColor}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M0.759661 186.952C0.190411 186.312 -0.0787035 185.461 0.0200493 184.61L9.19088 105.654C9.36659 104.141 10.6479 103 12.1708 103H29.2538C30.8634 103 32.1862 104.27 32.2513 105.879L33.3817 133.81L40.6727 105.258C41.0119 103.929 42.2085 103 43.5794 103H63C63.8559 103 64.6711 103.366 65.2404 104.005C65.8096 104.644 66.0787 105.496 65.98 106.346L56.8092 185.303C56.6334 186.815 55.3521 187.956 53.8292 187.956H41.6614C40.8055 187.956 39.9904 187.591 39.4212 186.952C38.8519 186.313 38.5827 185.461 38.6813 184.611L40.0342 172.944L36.6493 185.725C36.3008 187.04 35.1103 187.956 33.7493 187.956H23.2598C21.6599 187.956 20.3415 186.701 20.2633 185.103L19.6424 172.414L18.1479 185.302C17.9724 186.815 16.691 187.956 15.1678 187.956H3.00002C2.14408 187.956 1.32891 187.591 0.759661 186.952ZM20.6224 133.515H20.7423L23.2598 184.956H33.7493L47.5954 132.678H47.7153L41.6614 184.956H53.8292L63 106H43.5794L35.6673 136.984L30.8724 157.321L30.8122 157.322L30.5125 137.104L29.2538 106H12.1708L3.00002 184.956H15.1678L18.3447 157.561L20.6224 133.515Z"
			fill={strokeColor}
		/>
		<path
			d="M164 200.276L170.526 167.411H184.516C187.643 167.411 190.117 168.257 191.937 169.95C193.757 171.643 194.667 174.017 194.667 177.071C194.667 179.793 194.112 182.067 193.003 183.893C191.923 185.686 190.416 187.03 188.482 187.927C186.577 188.823 184.373 189.271 181.871 189.271L180.634 189.769H175.217L176.71 182.15H180.933C181.757 182.15 182.468 182.001 183.065 181.702C183.663 181.403 184.132 180.972 184.473 180.407C184.814 179.843 184.985 179.196 184.985 178.465C184.985 177.436 184.686 176.722 184.089 176.324C183.52 175.893 182.824 175.677 181.999 175.677H178.587L173.725 200.276H164ZM182.383 200.276L177.905 185.885L186.648 184.192L192.236 200.276H182.383Z"
			fill={fillColor}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M161.681 202.18C161.111 201.485 160.883 200.573 161.057 199.692L167.583 166.826C167.862 165.422 169.094 164.411 170.526 164.411H184.516C188.197 164.411 191.472 165.42 193.98 167.754C196.546 170.14 197.667 173.389 197.667 177.071C197.667 180.192 197.031 183.039 195.57 185.446C194.564 187.115 193.26 188.488 191.687 189.553L195.069 199.292C195.388 200.209 195.243 201.223 194.68 202.015C194.117 202.806 193.207 203.276 192.236 203.276H182.383C181.069 203.276 179.909 202.422 179.518 201.167L177.738 195.445L176.668 200.858C176.39 202.263 175.157 203.276 173.725 203.276H164C163.102 203.276 162.251 202.874 161.681 202.18ZM182.383 200.276H192.236L188.018 188.134C188.174 188.068 188.329 187.999 188.482 187.927C189.28 187.557 190.004 187.111 190.657 186.589C191.586 185.845 192.368 184.946 193.003 183.893C194.112 182.067 194.667 179.793 194.667 177.071C194.667 174.017 193.757 171.643 191.937 169.95C190.117 168.257 187.643 167.411 184.516 167.411H170.526L164 200.276H173.725L175.801 189.769H179.113L182.383 200.276ZM177.307 182.15H180.933C181.159 182.15 181.376 182.139 181.584 182.117C181.877 182.085 182.153 182.032 182.412 181.956C182.643 181.889 182.861 181.804 183.065 181.702C183.663 181.403 184.132 180.972 184.473 180.407C184.814 179.843 184.985 179.196 184.985 178.465C184.985 177.436 184.686 176.722 184.089 176.324C183.52 175.893 182.824 175.677 181.999 175.677H178.587L177.307 182.15ZM181.052 178.677L180.958 179.15C181.407 179.147 181.631 179.065 181.723 179.019C181.82 178.971 181.862 178.928 181.906 178.855C181.924 178.825 181.951 178.774 181.968 178.677H181.052Z"
			fill={strokeColor}
		/>
		<path
			d="M167.424 156.391L160.518 199.957H150L156.907 156.391H167.424Z"
			fill={fillColor}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M169.706 154.443C170.276 155.11 170.525 155.994 170.387 156.861L163.481 200.426C163.25 201.884 161.993 202.957 160.518 202.957H150C149.122 202.957 148.289 202.572 147.719 201.905C147.149 201.237 146.9 200.354 147.037 199.487L153.944 155.921C154.175 154.464 155.431 153.391 156.907 153.391H167.424C168.302 153.391 169.136 153.775 169.706 154.443ZM167.424 156.391H156.907L150 199.957H160.518L167.424 156.391Z"
			fill={strokeColor}
		/>
		<path
			d="M192.184 200.28L198.518 170.472H221.456L219.8 178.195H206.509L205.723 181.898H216.239L214.749 189.034H204.232L203.487 192.557H217.026L215.37 200.28H192.184Z"
			fill={fillColor}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M189.852 202.168C189.283 201.465 189.061 200.542 189.249 199.656L195.584 169.848C195.878 168.463 197.102 167.472 198.518 167.472H221.456C222.362 167.472 223.22 167.881 223.789 168.586C224.359 169.291 224.58 170.215 224.39 171.101L222.733 178.824C222.437 180.207 221.215 181.195 219.8 181.195H219.156C219.259 181.622 219.268 182.071 219.176 182.512L217.689 189.631C218.341 189.779 218.931 190.142 219.359 190.671C219.929 191.376 220.149 192.3 219.959 193.186L218.303 200.909C218.007 202.292 216.784 203.28 215.37 203.28H192.184C191.279 203.28 190.422 202.871 189.852 202.168ZM204.232 189.034H214.749L216.239 181.898H205.723L206.509 178.195H219.8L221.456 170.472H198.518L192.184 200.28H215.37L217.026 192.557H203.487L204.232 189.034Z"
			fill={strokeColor}
		/>
		<path
			d="M95.5601 56.65L127.784 3H152.236L157.476 56.65H138.351L138.089 45.92H122.02L116.344 56.65H95.5601ZM128.308 34.1333H137.74L137.478 16.2499L128.308 34.1333Z"
			fill={fillColor}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M92.9491 58.1275C92.4167 57.1866 92.4317 56.0321 92.9883 55.1053L125.212 1.45531C125.755 0.552377 126.731 0 127.784 0H152.236C153.78 0 155.072 1.17179 155.222 2.70839L160.462 56.3584C160.544 57.2008 160.266 58.0387 159.698 58.6656C159.129 59.2925 158.322 59.65 157.476 59.65H138.351C136.723 59.65 135.391 58.3511 135.352 56.7232L135.161 48.92H123.827L118.996 58.0528C118.476 59.0354 117.456 59.65 116.344 59.65H95.5601C94.479 59.65 93.4815 59.0684 92.9491 58.1275ZM122.02 45.92H138.089L138.351 56.65H157.476L152.236 3H127.784L95.5601 56.65H116.344L122.02 45.92ZM137.74 34.1333L137.478 16.2499L128.308 34.1333H137.74ZM133.218 31.1333H134.695L134.654 28.3315L133.218 31.1333Z"
			fill={strokeColor}
		/>
		<path
			d="M78.4217 42.7498H104.932L101.5 56.65H55L68.1265 3H88.1164L78.4217 42.7498Z"
			fill={fillColor}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M78.4217 42.7498H104.932L101.5 56.65H55L68.1265 3H88.1164L78.4217 42.7498ZM82.2414 39.7498H104.932C105.854 39.7498 106.725 40.174 107.294 40.9001C107.863 41.6262 108.066 42.5735 107.845 43.4688L104.413 57.3691C104.082 58.7087 102.88 59.65 101.5 59.65H55C54.0789 59.65 53.2088 59.2268 52.6401 58.5022C52.0713 57.7775 51.8671 56.8318 52.086 55.937L65.2124 2.28703C65.5409 0.944403 66.7443 0 68.1265 0H88.1164C89.0372 0 89.907 0.42284 90.4757 1.14697C91.0445 1.87109 91.2492 2.81629 91.031 3.71084L82.2414 39.7498Z"
			fill={strokeColor}
		/>
	</svg>
)

export default LaMemoireTsx
