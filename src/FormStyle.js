import metrics from "./Metrics";

const styles = {
  container: {
    flex: 1
  },
  sectionContainer: {
    flex: 1,
    padding: metrics.cardPadding,
    marginBottom: metrics.baseMargin * 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black"
  },
  sectionHeader: {
    padding: metrics.sectionHeaderPadding,
    backgroundColor: "#ebebeb"
  },
  button: {
    alignItems: 'center',
    backgroundColor: "#ad2960",
    margin: metrics.doubleBaseMargin,
    justifyContent: 'center',
    alignItems: 'center',
    height:54,
    borderRadius: 10,
  },
  description: {
    fontSize: 14,
    color: "rgba(0, 0, 0, .3)"
  },
  space: {
    height: metrics.doubleBaseMargin
  },
  buttonText:{
      textAlign:"center",
      fontSize:18,
      color:"white",
      fontWeight: 'bold',
  }
};

export default styles;
