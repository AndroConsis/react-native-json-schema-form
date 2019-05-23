import metrics from "./Metrics";

const styles = {
  container: {
    flex: 1
  },
  cardContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 2,
    shadowColor: "#ddd",
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    shadowOffset: {
      width: 1,
      height: 1
    },
    padding: metrics.cardPadding,
    marginTop: metrics.cardMarginTop,
    marginBottom: metrics.cardMarginTop,
    paddingBottom: metrics.cardMarginTop,
    shadowColor: "#ddd",
    shadowOpacity: 1.0,
    borderColor: "white"
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
    marginTop: metrics.doubleBaseMargin * 2,
    marginBottom: 0,
    height:40
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
      marginTop:8,
      fontSize:15,
      color:"white"
  }
};

export default styles;
