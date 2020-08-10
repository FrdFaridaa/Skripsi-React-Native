import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	divCenter: {
		flex: 1, 
		alignItems: 'center', 
		justifyContent: "center"
	},
	mar5: {
		margin: 5,
	},
	mar10: {
		margin: 10,
	},
	title: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 18,
		marginTop: 20
	},
	iconSel: {
		alignItems: 'center', 
		justifyContent: 'center',
		backgroundColor: '#f5f6fa',
		paddingTop: 15,
		paddingBottom: 15,
		borderRadius: 5,
		borderColor: '#dcdde1',
		borderWidth: 0.5
	},
	iconSelText: {
		textAlign: 'center',
		fontWeight: 'bold',
		marginTop: 10
	},
	formLogin: {
		margin: 30,
		marginTop: 10,
		marginBottom: 10,
	},
	shadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.37,
		shadowRadius: 7.49,

		elevation: 12,
	}
});

export default styles;