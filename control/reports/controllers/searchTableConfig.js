
const searchTableConfig ={
	options:{
		showEditButton:false,
		showDeleteButton:true
	}

	// reportedAt: new Date(),
	//reporter: WidgetBingewave.SocialItems.userDetails.email,
	//reported: event.title,
	//// reportedUserID: WidgetBingewave.post.userId,
	//// text: WidgetBingewave.post.text,
	//// postId: WidgetBingewave.post.id,
	//wid: WidgetBingewave.SocialItems.wid
	,columns:[
		{
			header:"Time/Date"
			,data:"${new Date(data.reportedAt).toLocaleDateString()}"
			,type:"date"
			,width:"120px"
			,sortBy: 'data.reportedAt'
		}
		,{
			header:"Reported"
			,data:"${data.reported.title}"
			,type:"string"
			,width:"150px"
			,sortBy: 'data.reported.title'
		}
		,{
			header:"Reporter"
			,data:"${data.reporter}"
			,type:"string"
			,width:"150px"
			,sortBy: 'data.reporter'
		}
		// ,{
		// 	header:"Reported post"
		// 	,data:"${data.text}"

		// 	,type:"string"
		// 	,width:"100px"
		// 	,sortBy: 'data.text',
		// 	command: 'showText'
		// }
	]

};