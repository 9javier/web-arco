package com.mirasense.scanditsdk.plugin.fragments;

import android.app.Activity;
import android.content.Context;
import android.content.res.Resources;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

import com.galvintec.krack.logistica.dev.R;
import com.mirasense.scanditsdk.plugin.adapters.ProcessedPickingStoresAdapter;

import org.json.JSONObject;

import java.util.ArrayList;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link ProcessedProductsPickingStores.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ProcessedProductsPickingStores#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ProcessedProductsPickingStores extends Fragment {
  // TODO: Rename parameter arguments, choose names that match
  // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
  private static final String ARG_PARAM1 = "param1";
  private static final String ARG_PARAM2 = "param2";

  // TODO: Rename and change types of parameters
  private String mParam1;
  private String mParam2;

  private static View mainView = null;

  private OnFragmentInteractionListener mListener;

  public ProcessedProductsPickingStores() {
    // Required empty public constructor
  }

  /**
   * Use this factory method to create a new instance of
   * this fragment using the provided parameters.
   *
   * @param param1 Parameter 1.
   * @param param2 Parameter 2.
   * @return A new instance of fragment ProcessedProductsPickingStores.
   */
  // TODO: Rename and change types and number of parameters
  public static ProcessedProductsPickingStores newInstance(String param1, String param2) {
    ProcessedProductsPickingStores fragment = new ProcessedProductsPickingStores();
    Bundle args = new Bundle();
    args.putString(ARG_PARAM1, param1);
    args.putString(ARG_PARAM2, param2);
    fragment.setArguments(args);
    return fragment;
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    if (getArguments() != null) {
      mParam1 = getArguments().getString(ARG_PARAM1);
      mParam2 = getArguments().getString(ARG_PARAM2);
    }
  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container,
                           Bundle savedInstanceState) {
    // Inflate the layout for this fragment
    mainView = inflater.inflate(R.layout.fragment_processed_products_picking_stores, container, false);

    return mainView;
  }

  public void updateListView(Activity activity, Resources resources, String package_name, ArrayList<JSONObject> productsProcessed) {
    ProcessedPickingStoresAdapter processedProductsAdapter = new ProcessedPickingStoresAdapter(activity, productsProcessed, resources, package_name);
    ListView lvProcessedPickingProducts = mainView.findViewById(resources.getIdentifier("lvProcessedPickingProducts", "id", package_name));
    lvProcessedPickingProducts.setAdapter(processedProductsAdapter);
  }

  public void updateListView() {

  }

  // TODO: Rename method, update argument and hook method into UI event
  public void onButtonPressed(Uri uri) {
    if (mListener != null) {
      mListener.onFragmentInteraction(uri);
    }
  }

  @Override
  public void onAttach(Context context) {
    super.onAttach(context);
    if (context instanceof OnFragmentInteractionListener) {
      mListener = (OnFragmentInteractionListener) context;
    } else {
      throw new RuntimeException(context.toString()
        + " must implement OnFragmentInteractionListener");
    }
  }

  @Override
  public void onDetach() {
    super.onDetach();
    mListener = null;
  }

  /**
   * This interface must be implemented by activities that contain this
   * fragment to allow an interaction in this fragment to be communicated
   * to the activity and potentially other fragments contained in that
   * activity.
   * <p>
   * See the Android Training lesson <a href=
   * "http://developer.android.com/training/basics/fragments/communicating.html"
   * >Communicating with Other Fragments</a> for more information.
   */
  public interface OnFragmentInteractionListener {
    // TODO: Update argument type and name
    void onFragmentInteraction(Uri uri);
  }
}
